# Backend Architecture Plan

## Overview

Multi-tenant NestJS REST API serving job advertisement platforms across multiple countries. Single backend instance serves multiple country-specific frontend applications, each with localized content and language support.

---

## Architecture Highlights

- **Multi-tenant** - One backend serves multiple country apps (e.g., jobs-hr.com, jobs-si.com, jobs-rs.com)
- **Multi-language** - Localized content per tenant, translatable job posts
- **Anonymous applications** - Users can apply without registration
- **Organization-based clients** - Employers manage multiple jobs under one organization

---

## Technology Stack

| Component | Technology |
|-----------|------------|
| Framework | NestJS 10.x |
| Language | TypeScript 5.x |
| Database | PostgreSQL |
| ORM | Prisma |
| Authentication | JWT + Refresh Tokens |
| Validation | class-validator / class-transformer |
| Documentation | Swagger/OpenAPI |
| File Storage | S3-compatible (AWS S3 / MinIO) |
| Email | Nodemailer + Templates |
| i18n | nestjs-i18n |

> **Post-MVP:** Redis (caching), BullMQ (background jobs)

---

## Multi-Tenancy Model

### Tenant Identification

Each country app is a **tenant** identified by:
- `tenantId` in database records
- Request header: `X-Tenant-ID` or domain-based resolution

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  jobs-hr.com    │     │  jobs-si.com    │     │  jobs-rs.com    │
│  (Croatia)      │     │  (Slovenia)     │     │  (Serbia)       │
└────────┬────────┘     └────────┬────────┘     └────────┬────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                         ┌───────▼───────┐
                         │   Shared API  │
                         │   Backend     │
                         └───────┬───────┘
                                 │
                         ┌───────▼───────┐
                         │  PostgreSQL   │
                         │  (all tenants)│
                         └───────────────┘
```

### Tenant Configuration

```typescript
interface TenantConfig {
  id: string;
  code: string;           // 'hr', 'si', 'rs'
  name: string;           // 'Croatia', 'Slovenia'
  domain: string;         // 'jobs-hr.com'
  defaultLanguage: string; // 'hr', 'sl', 'sr'
  supportedLanguages: string[];
  currency: string;       // 'EUR', 'RSD'
  timezone: string;
}
```

---

## User Types

### 1. End User (Job Seeker)
- Browse and search jobs
- View job details
- Apply for jobs (anonymous or registered)
- Manage profile and applications (if registered)

### 2. Client (Employer)
- Belongs to an **Organization**
- Post and manage job listings
- View applicants and applications
- Purchase ad tiers and promotions
- Multiple users per organization

### 3. Admin
- Platform management
- Tenant configuration
- Content moderation

---

## Project Structure

```
apps/api/src/
├── main.ts
├── app.module.ts
├── common/
│   ├── decorators/
│   │   ├── tenant.decorator.ts      # @CurrentTenant()
│   │   ├── user.decorator.ts        # @CurrentUser()
│   │   └── public.decorator.ts      # @Public()
│   ├── guards/
│   │   ├── jwt-auth.guard.ts
│   │   ├── roles.guard.ts
│   │   └── tenant.guard.ts
│   ├── interceptors/
│   │   ├── tenant.interceptor.ts    # Inject tenant context
│   │   └── transform.interceptor.ts
│   ├── filters/
│   │   └── http-exception.filter.ts
│   └── pipes/
│       └── validation.pipe.ts
├── config/
│   ├── config.module.ts
│   ├── database.config.ts
│   ├── auth.config.ts
│   ├── storage.config.ts
│   └── tenant.config.ts
├── modules/
│   ├── tenant/                # Tenant management
│   ├── auth/                  # Authentication
│   ├── users/                 # End user management
│   ├── organizations/         # Client organizations
│   ├── jobs/                  # Job listings
│   ├── applications/          # Job applications
│   ├── categories/            # Job categories
│   ├── locations/             # Locations (per tenant)
│   ├── payments/              # Payment processing
│   ├── files/                 # File uploads
│   ├── notifications/         # Email notifications
│   └── admin/                 # Admin operations
├── i18n/
│   ├── hr/                    # Croatian translations
│   ├── sl/                    # Slovenian translations
│   ├── sr/                    # Serbian translations
│   └── en/                    # English (fallback)
└── database/
    ├── prisma/
    │   └── schema.prisma
    └── seeds/
```

---

## Core Modules

### 1. Tenant Module

Manages multi-tenant configuration and context.

**Endpoints:**
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/tenants/current` | Get current tenant config | Public |
| GET | `/tenants/:code` | Get tenant by code | Public |

**Tenant Context Flow:**
1. Request arrives with domain or `X-Tenant-ID` header
2. `TenantInterceptor` resolves tenant from request
3. Tenant context injected into request for all subsequent operations
4. All queries automatically scoped to tenant

---

### 2. Auth Module

Authentication for both end users and clients.

**Endpoints:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | User registration |
| POST | `/auth/register/client` | Client/organization registration |
| POST | `/auth/login` | Login (user or client) |
| POST | `/auth/refresh` | Refresh access token |
| POST | `/auth/logout` | Invalidate current session |
| POST | `/auth/logout-all` | Invalidate all user sessions |
| POST | `/auth/forgot-password` | Request password reset |
| POST | `/auth/reset-password` | Reset password |
| GET | `/auth/me` | Get current user/client |
| GET | `/auth/sessions` | List active sessions |
| DELETE | `/auth/sessions/:id` | Revoke specific session |

**Authentication Modes:**
- **Registered users** - JWT-based authentication with session tracking
- **Anonymous applications** - No auth required, tracked by email

**Session Tracking:**
- Each login creates a new session record
- Sessions track device info, IP address, and last activity
- Users can view and revoke their active sessions
- Logout invalidates the current session
- Refresh tokens are tied to sessions

**User Roles:**
```typescript
enum UserRole {
  USER = 'USER',           // Job seeker
  CLIENT = 'CLIENT',       // Employer (belongs to org)
  CLIENT_ADMIN = 'CLIENT_ADMIN', // Org admin
  ADMIN = 'ADMIN',         // Platform admin
}
```

---

### 3. Users Module

End user profile management.

**Endpoints:**
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/users/profile` | Get own profile | Required |
| PATCH | `/users/profile` | Update profile | Required |
| POST | `/users/cv` | Upload CV | Required |
| DELETE | `/users/cv` | Remove CV | Required |
| GET | `/users/applications` | List own applications | Required |
| GET | `/users/saved-jobs` | List saved jobs | Required |
| POST | `/users/saved-jobs/:jobId` | Save job | Required |
| DELETE | `/users/saved-jobs/:jobId` | Unsave job | Required |
| GET | `/users/viewed-jobs` | List recently viewed jobs | Required |

---

### 4. Organizations Module

Client organization management.

**Endpoints:**
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/organizations/current` | Get own organization | Client |
| PATCH | `/organizations/current` | Update organization | Client Admin |
| POST | `/organizations/logo` | Upload logo | Client Admin |
| GET | `/organizations/members` | List org members | Client Admin |
| POST | `/organizations/members` | Invite member | Client Admin |
| DELETE | `/organizations/members/:id` | Remove member | Client Admin |
| GET | `/organizations/jobs` | List org's jobs | Client |
| GET | `/organizations/stats` | Organization analytics | Client |
| GET | `/organizations/invoices` | List invoices | Client |

**Public Endpoints:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/organizations/:slug` | Public org profile |
| GET | `/organizations/:slug/jobs` | Public org jobs |

---

### 5. Jobs Module

Core job listing functionality.

**Public Endpoints:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/jobs` | List jobs (filterable) |
| GET | `/jobs/:slug` | Get job details |
| GET | `/jobs/featured` | Get featured jobs |

**Client Endpoints:**
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/jobs` | Create job | Client |
| PATCH | `/jobs/:id` | Update job | Client |
| DELETE | `/jobs/:id` | Delete job | Client |
| POST | `/jobs/:id/publish` | Publish job (triggers payment) | Client |
| POST | `/jobs/:id/close` | Close job | Client |
| POST | `/jobs/:id/extend` | Extend job duration | Client |
| GET | `/jobs/:id/applications` | List job applicants | Client |
| GET | `/jobs/:id/stats` | Job analytics | Client |

**Query Filters:**
```typescript
interface JobFilters {
  search?: string;         // Full-text search
  categoryId?: string;
  locationId?: string;
  employmentType?: EmploymentType[];
  remoteOption?: RemoteOption;
  experienceLevel?: ExperienceLevel;
  salaryMin?: number;
  salaryMax?: number;
  postedAfter?: Date;
}
```

**Sorting Options:**
- `relevance` - Search relevance (default for search)
- `newest` - Most recent first
- `salary` - Highest salary first

**Visibility Rules:**
- Premium/Exclusive tiers appear higher in results
- Jobs scoped to tenant (country)
- Only `ACTIVE` jobs visible publicly

---

### 6. Applications Module

Job application management.

**Public Endpoints:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/applications` | Submit application (anonymous or auth) |
| GET | `/applications/:id/status` | Check application status (by email + token) |

**User Endpoints:**
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/applications` | List own applications | User |
| GET | `/applications/:id` | Get application details | User |

**Client Endpoints:**
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/applications` | List applications for org jobs | Client |
| GET | `/applications/:id` | Get application details | Client |
| PATCH | `/applications/:id/status` | Update status | Client |
| POST | `/applications/:id/notes` | Add internal note | Client |

**Anonymous Application Flow:**
```
1. User submits application with email (no login required)
2. System creates application record
3. Confirmation email sent with tracking link
4. User can check status via email + token
5. If user later registers with same email, applications linked
```

**Application Schema:**
```typescript
interface CreateApplicationDto {
  jobId: string;
  // Applicant info (for anonymous)
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  // Application content
  coverLetter?: string;
  cvFile?: File;           // Upload
  linkedinUrl?: string;
  portfolioUrl?: string;
}
```

**Application Statuses:**
```typescript
enum ApplicationStatus {
  PENDING = 'PENDING',
  REVIEWED = 'REVIEWED',
  SHORTLISTED = 'SHORTLISTED',
  INTERVIEW = 'INTERVIEW',
  OFFERED = 'OFFERED',
  HIRED = 'HIRED',
  REJECTED = 'REJECTED',
}
```

---

### 7. Categories Module

Job categories (can be tenant-specific or shared).

**Endpoints:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/categories` | List categories |
| GET | `/categories/:id` | Get category with subcategories |
| GET | `/categories/:id/jobs` | List jobs in category |

**Structure:**
- Hierarchical (parent/child)
- Translatable names per language

---

### 8. Locations Module

Geographic locations per tenant.

**Endpoints:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/locations` | List locations (country > region > city) |
| GET | `/locations/search` | Search locations |
| GET | `/locations/:id` | Get location details |

**Structure:**
- Tenant-scoped (each country has own locations)
- Hierarchical: Country → Region → City

---

### 9. Payments Module

Payment processing for job postings.

**Endpoints:**
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/payments/tiers` | List available tiers & prices | Public |
| POST | `/payments/checkout` | Create payment session | Client |
| POST | `/payments/webhook` | Payment provider callback | System |
| GET | `/payments/invoices` | List org invoices | Client |
| GET | `/payments/invoices/:id/pdf` | Download invoice | Client |

**Pricing Tiers:**
| Tier | Price | Features |
|------|-------|----------|
| **Basic** | €68 | Standard listing, unlimited description |
| **Standard** | €387 | Logo highlight, 10 CV database credits |
| **Premium** | €570 | Standard + search boost |
| **Exclusive** | €1,022 | Premium + category featuring, priority support |

**Promotional Add-ons:**
| Add-on | Price | Description |
|--------|-------|-------------|
| LinkedIn | +€50 | Social promotion |
| Instagram | +€50 | Social promotion |
| Facebook | +€50 | Social promotion |

**Payment Flow:**
```
1. Client creates job (DRAFT status)
2. Client selects tier + add-ons
3. POST /payments/checkout creates Stripe session
4. Client completes payment on Stripe
5. Webhook receives confirmation
6. Job status → ACTIVE, publishedAt set
```

---

### 10. Files Module

File upload and storage.

**Endpoints:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/files/upload` | Upload file |
| GET | `/files/:id` | Get file (signed URL) |
| DELETE | `/files/:id` | Delete file |

**File Types:**
| Type | Formats | Max Size |
|------|---------|----------|
| CV | PDF, DOC, DOCX | 5MB |
| Logo | PNG, JPG, SVG | 2MB |
| Profile Photo | PNG, JPG | 2MB |

---

### 11. Notifications Module

Email notifications.

**Notification Types:**
| Type | Recipient | Trigger |
|------|-----------|---------|
| `APPLICATION_SUBMITTED` | Applicant | Application created |
| `APPLICATION_RECEIVED` | Client | New application |
| `APPLICATION_STATUS_CHANGED` | Applicant | Status update |
| `JOB_PUBLISHED` | Client | Job goes live |
| `JOB_EXPIRING` | Client | 3 days before expiry |
| `PAYMENT_SUCCESS` | Client | Payment confirmed |
| `WELCOME` | User/Client | Registration |
| `PASSWORD_RESET` | User/Client | Reset requested |

**MVP Implementation:**
- Synchronous email sending
- Handlebars templates
- Per-tenant email templates and branding

---

### 12. Admin Module

Platform administration.

**Endpoints:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/admin/tenants` | List tenants |
| POST | `/admin/tenants` | Create tenant |
| PATCH | `/admin/tenants/:id` | Update tenant |
| GET | `/admin/organizations` | List all organizations |
| PATCH | `/admin/organizations/:id/verify` | Verify organization |
| GET | `/admin/jobs` | List all jobs |
| PATCH | `/admin/jobs/:id` | Moderate job |
| GET | `/admin/users` | List users |
| GET | `/admin/reports` | Platform reports |

---

## Database Schema

### Core Models

```prisma
// ============ TENANT ============

model Tenant {
  id                 String   @id @default(cuid())
  code               String   @unique  // 'hr', 'si', 'rs'
  name               String
  domain             String   @unique
  defaultLanguage    String   @default("en")
  supportedLanguages String[]
  currency           String   @default("EUR")
  timezone           String   @default("Europe/Zagreb")
  isActive           Boolean  @default(true)
  createdAt          DateTime @default(now())
  updatedAt          DateTime @updatedAt

  organizations Organization[]
  users         User[]
  jobs          Job[]
  locations     Location[]
  categories    Category[]
}

// ============ AUTH & USERS ============

model User {
  id            String    @id @default(cuid())
  tenantId      String
  tenant        Tenant    @relation(fields: [tenantId], references: [id])
  email         String
  passwordHash  String?   // Null for anonymous applicants
  role          UserRole  @default(USER)
  emailVerified Boolean   @default(false)
  language      String    @default("en")
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  profile        UserProfile?
  sessions       Session[]
  applications   Application[]
  savedJobs      SavedJob[]
  jobViews       JobView[]

  // For clients
  organizationId String?
  organization   Organization? @relation(fields: [organizationId], references: [id])

  @@unique([tenantId, email])
}

model UserProfile {
  id        String   @id @default(cuid())
  userId    String   @unique
  user      User     @relation(fields: [userId], references: [id])
  firstName String
  lastName  String
  phone     String?
  cvFileId  String?
  cvFile    File?    @relation("UserCV", fields: [cvFileId], references: [id])
  headline  String?
  summary   String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Session {
  id            String    @id @default(cuid())
  userId        String
  user          User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  userAgent     String?
  ipAddress     String?
  deviceType    String?   // 'desktop', 'mobile', 'tablet'
  lastActivityAt DateTime @default(now())
  expiresAt     DateTime
  createdAt     DateTime  @default(now())

  refreshToken  RefreshToken?

  @@index([userId])
  @@index([expiresAt])
}

model RefreshToken {
  id        String   @id @default(cuid())
  sessionId String   @unique
  session   Session  @relation(fields: [sessionId], references: [id], onDelete: Cascade)
  token     String   @unique
  expiresAt DateTime
  createdAt DateTime @default(now())
}

// ============ ORGANIZATIONS ============

model Organization {
  id          String       @id @default(cuid())
  tenantId    String
  tenant      Tenant       @relation(fields: [tenantId], references: [id])
  name        String
  slug        String
  description String?
  website     String?
  logoFileId  String?
  logoFile    File?        @relation("OrgLogo", fields: [logoFileId], references: [id])
  industry    String?
  size        CompanySize?
  isVerified  Boolean      @default(false)
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt

  members    User[]
  jobs       Job[]
  payments   Payment[]
  cvCredits  CvCredit[]

  @@unique([tenantId, slug])
}

// ============ JOBS ============

model Job {
  id              String          @id @default(cuid())
  tenantId        String
  tenant          Tenant          @relation(fields: [tenantId], references: [id])
  organizationId  String
  organization    Organization    @relation(fields: [organizationId], references: [id])

  // Content
  title           String
  slug            String
  description     String
  requirements    String?
  benefits        String?

  // Classification
  categoryId      String
  category        Category        @relation(fields: [categoryId], references: [id])
  locationId      String?
  location        Location?       @relation(fields: [locationId], references: [id])

  // Job details
  employmentType  EmploymentType
  remoteOption    RemoteOption    @default(NO)
  experienceLevel ExperienceLevel?
  salaryMin       Int?
  salaryMax       Int?
  salaryCurrency  String          @default("EUR")
  salaryPeriod    SalaryPeriod    @default(MONTHLY)

  // Tier & visibility
  tier            AdTier          @default(BASIC)
  promotions      PromotionAddon[]

  // Status & dates
  status          JobStatus       @default(DRAFT)
  publishedAt     DateTime?
  expiresAt       DateTime?
  viewCount       Int             @default(0)

  createdAt       DateTime        @default(now())
  updatedAt       DateTime        @updatedAt

  applications Application[]
  savedBy      SavedJob[]
  views        JobView[]
  payment      Payment?

  @@unique([tenantId, slug])
  @@index([tenantId, status])
  @@index([categoryId])
  @@index([locationId])
  @@index([publishedAt])
}

// ============ APPLICATIONS ============

model Application {
  id          String            @id @default(cuid())
  jobId       String
  job         Job               @relation(fields: [jobId], references: [id])

  // Applicant (linked user or anonymous)
  userId      String?
  user        User?             @relation(fields: [userId], references: [id])

  // Applicant info (always stored, for anonymous flow)
  email       String
  firstName   String
  lastName    String
  phone       String?

  // Application content
  coverLetter String?
  cvFileId    String?
  cvFile      File?             @relation("ApplicationCV", fields: [cvFileId], references: [id])
  linkedinUrl String?
  portfolioUrl String?

  // Tracking
  status      ApplicationStatus @default(PENDING)
  notes       String?           // Internal notes by client
  trackingToken String          @unique @default(cuid())

  createdAt   DateTime          @default(now())
  updatedAt   DateTime          @updatedAt

  @@unique([jobId, email])
  @@index([jobId])
  @@index([email])
}

model SavedJob {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  jobId     String
  job       Job      @relation(fields: [jobId], references: [id])
  createdAt DateTime @default(now())

  @@unique([userId, jobId])
}

model JobView {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  jobId     String
  job       Job      @relation(fields: [jobId], references: [id])
  viewedAt  DateTime @default(now())

  @@unique([userId, jobId])
  @@index([userId])
  @@index([jobId])
}

// ============ CATEGORIES & LOCATIONS ============

model Category {
  id       String     @id @default(cuid())
  tenantId String?    // Null = shared across tenants
  tenant   Tenant?    @relation(fields: [tenantId], references: [id])
  parentId String?
  parent   Category?  @relation("CategoryTree", fields: [parentId], references: [id])
  children Category[] @relation("CategoryTree")

  slug     String

  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt

  translations CategoryTranslation[]
  jobs         Job[]

  @@unique([tenantId, slug])
}

model CategoryTranslation {
  id         String   @id @default(cuid())
  categoryId String
  category   Category @relation(fields: [categoryId], references: [id])
  language   String
  name       String

  @@unique([categoryId, language])
}

model Location {
  id       String       @id @default(cuid())
  tenantId String
  tenant   Tenant       @relation(fields: [tenantId], references: [id])
  parentId String?
  parent   Location?    @relation("LocationTree", fields: [parentId], references: [id])
  children Location[]   @relation("LocationTree")

  type     LocationType
  slug     String
  name     String

  createdAt DateTime    @default(now())
  updatedAt DateTime    @updatedAt

  jobs Job[]

  @@unique([tenantId, slug])
}

// ============ PAYMENTS ============

model Payment {
  id            String          @id @default(cuid())
  organizationId String
  organization  Organization    @relation(fields: [organizationId], references: [id])
  jobId         String          @unique
  job           Job             @relation(fields: [jobId], references: [id])

  amount        Int             // cents
  currency      String          @default("EUR")
  tier          AdTier
  promotions    PromotionAddon[]

  status        PaymentStatus   @default(PENDING)
  providerRef   String?         // Stripe payment intent
  invoiceNumber String?         @unique

  paidAt        DateTime?
  createdAt     DateTime        @default(now())
  updatedAt     DateTime        @updatedAt
}

model CvCredit {
  id             String       @id @default(cuid())
  organizationId String
  organization   Organization @relation(fields: [organizationId], references: [id])
  jobId          String
  total          Int          // Credits granted
  used           Int          @default(0)
  createdAt      DateTime     @default(now())
}

// ============ FILES ============

model File {
  id        String   @id @default(cuid())
  filename  String
  mimeType  String
  size      Int
  path      String   // S3 key
  createdAt DateTime @default(now())

  userProfiles    UserProfile[]  @relation("UserCV")
  organizations   Organization[] @relation("OrgLogo")
  applications    Application[]  @relation("ApplicationCV")
}
```

### Enums

```prisma
enum UserRole {
  USER          // Job seeker
  CLIENT        // Employer (org member)
  CLIENT_ADMIN  // Employer (org admin)
  ADMIN         // Platform admin
}

enum AdTier {
  BASIC
  STANDARD
  PREMIUM
  EXCLUSIVE
}

enum PromotionAddon {
  LINKEDIN
  INSTAGRAM
  FACEBOOK
}

enum JobStatus {
  DRAFT
  PENDING_PAYMENT
  ACTIVE
  EXPIRED
  CLOSED
}

enum ApplicationStatus {
  PENDING
  REVIEWED
  SHORTLISTED
  INTERVIEW
  OFFERED
  HIRED
  REJECTED
}

enum EmploymentType {
  FULL_TIME
  PART_TIME
  CONTRACT
  INTERNSHIP
  FREELANCE
}

enum RemoteOption {
  NO
  HYBRID
  FULL
}

enum ExperienceLevel {
  ENTRY
  JUNIOR
  MID
  SENIOR
  LEAD
  EXECUTIVE
}

enum CompanySize {
  STARTUP     // 1-10
  SMALL       // 11-50
  MEDIUM      // 51-200
  LARGE       // 201-1000
  ENTERPRISE  // 1000+
}

enum SalaryPeriod {
  HOURLY
  MONTHLY
  YEARLY
}

enum PaymentStatus {
  PENDING
  COMPLETED
  FAILED
  REFUNDED
}

enum LocationType {
  COUNTRY
  REGION
  CITY
}
```

---

## API Design

### Request Headers

| Header | Description | Required |
|--------|-------------|----------|
| `X-Tenant-ID` | Tenant identifier (or resolved from domain) | Yes |
| `Accept-Language` | Preferred language (e.g., `hr`, `en`) | No |
| `Authorization` | Bearer token | For protected routes |

### Response Format

```typescript
// Success
{
  "data": { ... },
  "meta": {
    "timestamp": "2024-01-15T10:30:00Z",
    "language": "hr"
  }
}

// Paginated
{
  "data": [...],
  "meta": {
    "total": 150,
    "page": 1,
    "perPage": 20,
    "totalPages": 8
  }
}

// Error
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [...]
  }
}
```

### HTTP Status Codes

| Code | Usage |
|------|-------|
| 200 | Success |
| 201 | Created |
| 204 | No content |
| 400 | Bad request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not found |
| 409 | Conflict |
| 422 | Validation error |
| 500 | Server error |

---

## Security

### Authentication
- JWT access tokens (15 min expiry)
- Refresh tokens (7 days, tied to sessions)
- Password hashing (bcrypt)

### Session Management
- Session created on each login
- Tracks: user agent, IP address, device type, last activity
- Users can list and revoke active sessions
- Sessions auto-expire after inactivity
- Cascade delete: revoking session invalidates refresh token

### Authorization
- Role-based guards (`@Roles()`)
- Resource ownership validation
- Tenant isolation on all queries

### Data Protection
- Input validation (class-validator)
- Tenant scoping prevents cross-tenant access
- Signed URLs for file access

---

## Internationalization (i18n)

### Implementation
- `nestjs-i18n` for translations
- Language resolved from: `Accept-Language` header → User preference → Tenant default

### Translatable Content
- UI strings (error messages, emails)
- Category names
- Static content

### Non-translatable (User-generated)
- Job titles and descriptions
- Organization profiles
- Applications

---

## Environment Configuration

```env
# App
NODE_ENV=development
PORT=3001
API_URL=http://localhost:3001

# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/jobboard

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d

# Storage (S3)
S3_ENDPOINT=https://s3.amazonaws.com
S3_BUCKET=jobboard-files
S3_ACCESS_KEY=xxx
S3_SECRET_KEY=xxx
S3_REGION=eu-central-1

# Payment (Stripe)
STRIPE_SECRET_KEY=sk_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# Email
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=xxx
SMTP_PASS=xxx
EMAIL_FROM=noreply@jobboard.com

# Frontend URLs (for emails, redirects)
WEB_URL_HR=https://jobs-hr.com
WEB_URL_SI=https://jobs-si.com
WEB_URL_RS=https://jobs-rs.com
```

---

## Testing

| Type | Tool | Scope |
|------|------|-------|
| Unit | Jest | Services, utilities |
| Integration | Jest + Supertest | API endpoints |
| E2E | Jest | Full user flows |

---

## Deployment

- Docker containerized
- Health check: `GET /health`
- Readiness check: `GET /ready`
- Single deployment serves all tenants
- Environment-based configuration
