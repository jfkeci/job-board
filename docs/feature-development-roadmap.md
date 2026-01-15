# Feature Development Roadmap

This document outlines the proposed next steps for feature development based on the business plan, ER diagram, and current codebase state.

---

## Current State Summary

| Component | Status | Notes |
|-----------|--------|-------|
| Database Entities | Complete | 16 entities fully defined with relationships |
| API (NestJS) | Minimal | Only health check endpoints |
| Web App (B2C) | Boilerplate | Placeholder pages only |
| Dashboard (B2B) | Scaffolding | Mock pages, glassmorphism UI setup |
| Shared Packages | Solid | Logging, exceptions, UI system, types |

---

## Phase 1: Core Foundation

Priority: **Critical** - Required before any user-facing features.

### 1.1 Authentication & Authorization

- [ ] **Auth Module (API)**
  - [ ] Implement JWT authentication with access/refresh tokens
  - [ ] Create auth controller endpoints:
    - `POST /auth/register` - User registration
    - `POST /auth/login` - User login (returns tokens)
    - `POST /auth/refresh` - Refresh access token
    - `POST /auth/logout` - Invalidate session
    - `POST /auth/forgot-password` - Request password reset
    - `POST /auth/reset-password` - Reset password with token
    - `POST /auth/verify-email` - Email verification
  - [ ] Implement password hashing (bcrypt/argon2)
  - [ ] Create AuthGuard for protected routes
  - [ ] Implement role-based access control (RBAC) with `UserRole` enum
  - [ ] Session management service (create, track, expire)
  - [ ] RefreshToken rotation logic

- [ ] **Tenant Resolution**
  - [ ] Tenant middleware (resolve tenant from domain/subdomain)
  - [ ] TenantGuard for multi-tenant isolation
  - [ ] Seed initial tenants (hr, si, rs)

### 1.2 User Management

- [ ] **Users Module (API)**
  - [ ] Create users controller:
    - `GET /users/me` - Get current user profile
    - `PATCH /users/me` - Update current user
    - `DELETE /users/me` - Delete account
  - [ ] UserProfile CRUD operations
  - [ ] Email uniqueness validation per tenant

### 1.3 File Upload Infrastructure

- [ ] **Files Module (API)**
  - [ ] S3/MinIO integration for file storage
  - [ ] File upload controller:
    - `POST /files/upload` - Upload file (CV, logo)
    - `GET /files/:id` - Get file metadata
    - `GET /files/:id/download` - Generate signed download URL
  - [ ] File type validation (PDF, images)
  - [ ] File size limits
  - [ ] Virus scanning integration (optional)

---

## Phase 2: B2B Employer Features

Priority: **High** - Revenue-generating features.

### 2.1 Organization Management

- [ ] **Organizations Module (API)**
  - [ ] Organizations controller:
    - `POST /organizations` - Create organization
    - `GET /organizations/:id` - Get organization
    - `PATCH /organizations/:id` - Update organization
    - `DELETE /organizations/:id` - Delete organization
    - `POST /organizations/:id/logo` - Upload logo
  - [ ] Organization verification workflow
  - [ ] Invite team members to organization
  - [ ] Organization member role management

### 2.2 Job Posting System

- [ ] **Jobs Module (API)**
  - [ ] Jobs controller (employer):
    - `POST /jobs` - Create job draft
    - `GET /jobs` - List organization's jobs
    - `GET /jobs/:id` - Get job details
    - `PATCH /jobs/:id` - Update job
    - `DELETE /jobs/:id` - Delete job
    - `POST /jobs/:id/publish` - Publish job (triggers payment)
    - `POST /jobs/:id/close` - Close job listing
    - `POST /jobs/:id/extend` - Extend expiration
  - [ ] Job status state machine (DRAFT → PENDING_PAYMENT → ACTIVE → EXPIRED/CLOSED)
  - [ ] Automatic slug generation
  - [ ] Job expiration scheduler (cron job)
  - [ ] View count tracking

### 2.3 Categories & Locations

- [ ] **Categories Module (API)**
  - [ ] Categories controller:
    - `GET /categories` - List categories (with translations)
    - `GET /categories/:id` - Get category with children
  - [ ] Hierarchical category tree
  - [ ] Category seeding script

- [ ] **Locations Module (API)**
  - [ ] Locations controller:
    - `GET /locations` - List locations (hierarchical)
    - `GET /locations/:id` - Get location with children
  - [ ] Location seeding per tenant (countries, regions, cities)

### 2.4 Payment & Billing

- [ ] **Payments Module (API)**
  - [ ] Stripe integration
  - [ ] Payments controller:
    - `POST /payments/create-intent` - Create payment intent for job
    - `POST /payments/webhook` - Stripe webhook handler
    - `GET /payments` - List organization payments
    - `GET /payments/:id` - Get payment details
    - `GET /payments/:id/invoice` - Download invoice
  - [ ] Tier pricing configuration
  - [ ] Promotional add-ons pricing
  - [ ] Invoice generation
  - [ ] CV credit allocation on Standard+ tier purchase

### 2.5 Application Management (Employer View)

- [ ] **Applications Module (API) - Employer endpoints**
  - [ ] Applications controller:
    - `GET /jobs/:jobId/applications` - List applications for job
    - `GET /applications/:id` - Get application details
    - `PATCH /applications/:id/status` - Update application status
    - `POST /applications/:id/notes` - Add internal notes
  - [ ] Application status workflow
  - [ ] Email notifications to applicants on status change

### 2.6 CV Database Access

- [ ] **CV Access Module (API)**
  - [ ] CV search controller:
    - `GET /cv-database` - Search job seeker profiles
    - `POST /cv-database/:profileId/download` - Download CV (uses credit)
  - [ ] CV credit checking middleware
  - [ ] Search filters (skills, location, experience)

---

## Phase 3: B2C Job Seeker Features

Priority: **High** - User acquisition.

### 3.1 Public Job Board

- [ ] **Public Jobs Controller (API)**
  - [ ] Public endpoints (no auth required):
    - `GET /public/jobs` - Search/list active jobs
    - `GET /public/jobs/:slug` - Get job details by slug
    - `GET /public/categories` - List categories
    - `GET /public/locations` - List locations
    - `GET /public/organizations/:slug` - View company profile
  - [ ] Advanced search with filters:
    - Keyword search
    - Category filter
    - Location filter
    - Employment type filter
    - Remote option filter
    - Salary range filter
    - Experience level filter
  - [ ] Sorting options (date, relevance, salary)
  - [ ] Pagination

### 3.2 Job Seeker Profile

- [ ] **Profile Module (API)**
  - [ ] Profile controller:
    - `GET /profile` - Get own profile
    - `PATCH /profile` - Update profile
    - `POST /profile/cv` - Upload CV
    - `DELETE /profile/cv` - Remove CV
  - [ ] Profile completeness score
  - [ ] Privacy settings (visible to employers or not)

### 3.3 Application System

- [ ] **Applications Module (API) - Applicant endpoints**
  - [ ] Application controller:
    - `POST /jobs/:id/apply` - Submit application
    - `GET /applications` - List own applications
    - `GET /applications/:id` - Get application status
    - `DELETE /applications/:id` - Withdraw application
  - [ ] Anonymous applications (no account required, trackable by token)
  - [ ] Application tracking via email token
  - [ ] Duplicate application prevention

### 3.4 Saved Jobs & Alerts

- [ ] **Saved Jobs Module (API)**
  - [ ] Saved jobs controller:
    - `POST /jobs/:id/save` - Save job
    - `DELETE /jobs/:id/save` - Unsave job
    - `GET /saved-jobs` - List saved jobs
  - [ ] Job view history tracking

- [ ] **Job Alerts Module (API)**
  - [ ] Alerts controller:
    - `POST /alerts` - Create job alert
    - `GET /alerts` - List alerts
    - `PATCH /alerts/:id` - Update alert
    - `DELETE /alerts/:id` - Delete alert
  - [ ] Alert matching cron job
  - [ ] Email digest (daily/weekly)

---

## Phase 4: Dashboard (B2B Frontend)

Priority: **High** - Employer experience.

### 4.1 Authentication Pages

- [ ] Complete login page with API integration
- [ ] Registration flow (organization + admin user)
- [ ] Password reset flow
- [ ] Email verification page

### 4.2 Organization Setup

- [ ] Organization profile editor
- [ ] Logo upload component
- [ ] Team member management page
- [ ] Billing settings page

### 4.3 Job Management Pages

- [ ] Job listing page (with filters, pagination)
- [ ] Job creation wizard:
  - Step 1: Basic info (title, category, location)
  - Step 2: Description (rich text editor)
  - Step 3: Requirements & benefits
  - Step 4: Salary & employment details
  - Step 5: Tier selection & add-ons
  - Step 6: Preview & publish
- [ ] Job edit page
- [ ] Job analytics page (views, applications over time)

### 4.4 Application Management

- [ ] Applications inbox (kanban or table view)
- [ ] Application detail view with CV preview
- [ ] Status update actions
- [ ] Internal notes editor
- [ ] Bulk actions (reject, shortlist)

### 4.5 CV Database Browser

- [ ] CV search page with filters
- [ ] Candidate profile view
- [ ] CV download with credit tracking
- [ ] Credit balance display

### 4.6 Billing & Invoices

- [ ] Payment history page
- [ ] Invoice download
- [ ] Current plan/credits overview

---

## Phase 5: Web App (B2C Frontend)

Priority: **High** - Job seeker experience.

### 5.1 Public Pages

- [ ] Homepage with featured jobs
- [ ] Job search page with filters
- [ ] Job detail page
- [ ] Company profile page
- [ ] Category browse page
- [ ] Location browse page

### 5.2 Authentication

- [ ] Login page
- [ ] Registration page
- [ ] Password reset flow
- [ ] Email verification page

### 5.3 Job Seeker Dashboard

- [ ] Profile editor
- [ ] CV upload/management
- [ ] Application history
- [ ] Saved jobs page
- [ ] Job alerts management

### 5.4 Application Flow

- [ ] Quick apply form (pre-filled from profile)
- [ ] Anonymous apply form (no account)
- [ ] Application confirmation page
- [ ] Application status tracking page (via token)

---

## Phase 6: Admin & Operations

Priority: **Medium** - Platform management.

### 6.1 Admin Module (API)

- [ ] Admin controller:
  - `GET /admin/users` - List all users
  - `PATCH /admin/users/:id` - Update user (ban, role change)
  - `GET /admin/organizations` - List organizations
  - `PATCH /admin/organizations/:id/verify` - Verify organization
  - `GET /admin/jobs` - List all jobs
  - `PATCH /admin/jobs/:id` - Moderate job listing
  - `GET /admin/payments` - List payments
  - `GET /admin/stats` - Platform statistics

### 6.2 Notification System

- [ ] **Notifications Module (API)**
  - [ ] Email service integration (SendGrid/SES)
  - [ ] Email templates:
    - Welcome email
    - Email verification
    - Password reset
    - Application received (to employer)
    - Application status update (to applicant)
    - Job alert digest
    - Job expiring soon
  - [ ] Notification preferences per user

### 6.3 Analytics & Reporting

- [ ] **Analytics Module (API)**
  - [ ] Job performance metrics
  - [ ] Platform-wide statistics
  - [ ] Revenue reports
  - [ ] Export functionality

---

## Phase 7: Social Media Promotions

Priority: **Medium** - Add-on revenue.

### 7.1 Social Promotion Service

- [ ] LinkedIn posting integration
- [ ] Facebook posting integration
- [ ] Instagram posting integration
- [ ] Promotion queue and scheduler
- [ ] Promotion status tracking

---

## Phase 8: Advanced Features (Scale Phase)

Priority: **Low** - Future enhancements.

### 8.1 API for Aggregators

- [ ] Public API endpoints for job aggregators
- [ ] API key management
- [ ] Rate limiting
- [ ] Webhook notifications

### 8.2 Mobile Optimization

- [ ] Responsive design audit
- [ ] PWA setup
- [ ] Push notifications

### 8.3 Performance & SEO

- [ ] Job listing SEO (structured data, meta tags)
- [ ] Sitemap generation
- [ ] Performance optimization
- [ ] CDN setup for static assets

---

## Suggested Implementation Order

Based on dependencies and business value:

1. **Auth & Tenant** → Everything depends on this
2. **File Upload** → Required for CVs and logos
3. **Organizations** → Required for job posting
4. **Categories & Locations** → Required for job creation
5. **Jobs (CRUD)** → Core B2B feature
6. **Public Jobs** → Core B2C feature
7. **Payments** → Revenue enablement
8. **Applications (both sides)** → Core user flow
9. **Dashboard integration** → B2B UX
10. **Web app integration** → B2C UX
11. **Notifications** → User engagement
12. **CV Database** → Premium feature
13. **Admin tools** → Operations
14. **Social promotions** → Add-on revenue
15. **Advanced features** → Scale phase

---

## Technical Debt & Improvements

- [ ] Add comprehensive test coverage (unit + e2e)
- [ ] Set up CI/CD pipeline
- [ ] Add API documentation (Swagger/OpenAPI)
- [ ] Implement request validation with class-validator DTOs
- [ ] Add rate limiting middleware
- [ ] Set up error monitoring (Sentry)
- [ ] Implement database migrations strategy
- [ ] Add health checks for all dependencies
- [ ] Set up staging environment

---

*Last updated: 2026-01-15*
