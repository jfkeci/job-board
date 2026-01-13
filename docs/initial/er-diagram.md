# Entity Relationship Diagram

```mermaid
erDiagram
    %% ============ TENANT ============
    Tenant {
        string id PK
        string code UK "hr, si, rs"
        string name
        string domain UK
        string defaultLanguage
        string[] supportedLanguages
        string currency
        string timezone
        boolean isActive
        datetime createdAt
        datetime updatedAt
    }

    %% ============ USERS & AUTH ============
    User {
        string id PK
        string tenantId FK
        string email
        string passwordHash "nullable"
        enum role "USER, CLIENT, CLIENT_ADMIN, ADMIN"
        boolean emailVerified
        string language
        string organizationId FK "nullable"
        datetime createdAt
        datetime updatedAt
    }

    UserProfile {
        string id PK
        string userId FK,UK
        string firstName
        string lastName
        string phone "nullable"
        string cvFileId FK "nullable"
        string headline "nullable"
        string summary "nullable"
        datetime createdAt
        datetime updatedAt
    }

    Session {
        string id PK
        string userId FK
        string userAgent "nullable"
        string ipAddress "nullable"
        string deviceType "nullable"
        datetime lastActivityAt
        datetime expiresAt
        datetime createdAt
    }

    RefreshToken {
        string id PK
        string sessionId FK,UK
        string token UK
        datetime expiresAt
        datetime createdAt
    }

    %% ============ ORGANIZATIONS ============
    Organization {
        string id PK
        string tenantId FK
        string name
        string slug
        string description "nullable"
        string website "nullable"
        string logoFileId FK "nullable"
        string industry "nullable"
        enum size "nullable"
        boolean isVerified
        datetime createdAt
        datetime updatedAt
    }

    %% ============ JOBS ============
    Job {
        string id PK
        string tenantId FK
        string organizationId FK
        string title
        string slug
        string description
        string requirements "nullable"
        string benefits "nullable"
        string categoryId FK
        string locationId FK "nullable"
        enum employmentType
        enum remoteOption
        enum experienceLevel "nullable"
        int salaryMin "nullable"
        int salaryMax "nullable"
        string salaryCurrency
        enum salaryPeriod
        enum tier "BASIC, STANDARD, PREMIUM, EXCLUSIVE"
        enum[] promotions
        enum status "DRAFT, PENDING_PAYMENT, ACTIVE, EXPIRED, CLOSED"
        datetime publishedAt "nullable"
        datetime expiresAt "nullable"
        int viewCount
        datetime createdAt
        datetime updatedAt
    }

    %% ============ APPLICATIONS ============
    Application {
        string id PK
        string jobId FK
        string userId FK "nullable"
        string email
        string firstName
        string lastName
        string phone "nullable"
        string coverLetter "nullable"
        string cvFileId FK "nullable"
        string linkedinUrl "nullable"
        string portfolioUrl "nullable"
        enum status "PENDING, REVIEWED, SHORTLISTED, INTERVIEW, OFFERED, HIRED, REJECTED"
        string notes "nullable"
        string trackingToken UK
        datetime createdAt
        datetime updatedAt
    }

    SavedJob {
        string id PK
        string userId FK
        string jobId FK
        datetime createdAt
    }

    JobView {
        string id PK
        string userId FK
        string jobId FK
        datetime viewedAt
    }

    %% ============ CATEGORIES & LOCATIONS ============
    Category {
        string id PK
        string tenantId FK "nullable, shared if null"
        string parentId FK "nullable"
        string slug
        datetime createdAt
        datetime updatedAt
    }

    CategoryTranslation {
        string id PK
        string categoryId FK
        string language
        string name
    }

    Location {
        string id PK
        string tenantId FK
        string parentId FK "nullable"
        enum type "COUNTRY, REGION, CITY"
        string slug
        string name
        datetime createdAt
        datetime updatedAt
    }

    %% ============ PAYMENTS ============
    Payment {
        string id PK
        string organizationId FK
        string jobId FK,UK
        int amount "cents"
        string currency
        enum tier
        enum[] promotions
        enum status "PENDING, COMPLETED, FAILED, REFUNDED"
        string providerRef "nullable"
        string invoiceNumber UK "nullable"
        datetime paidAt "nullable"
        datetime createdAt
        datetime updatedAt
    }

    CvCredit {
        string id PK
        string organizationId FK
        string jobId
        int total
        int used
        datetime createdAt
    }

    %% ============ FILES ============
    File {
        string id PK
        string filename
        string mimeType
        int size
        string path "S3 key"
        datetime createdAt
    }

    %% ============ RELATIONSHIPS ============

    %% Tenant relationships
    Tenant ||--o{ User : "has"
    Tenant ||--o{ Organization : "has"
    Tenant ||--o{ Job : "has"
    Tenant ||--o{ Location : "has"
    Tenant ||--o{ Category : "has (optional)"

    %% User relationships
    User ||--o| UserProfile : "has"
    User ||--o{ Session : "has"
    User ||--o{ Application : "submits"
    User ||--o{ SavedJob : "saves"
    User ||--o{ JobView : "views"
    User }o--o| Organization : "belongs to"

    %% Session relationships
    Session ||--o| RefreshToken : "has"

    %% Organization relationships
    Organization ||--o{ Job : "posts"
    Organization ||--o{ Payment : "makes"
    Organization ||--o{ CvCredit : "has"

    %% Job relationships
    Job ||--o{ Application : "receives"
    Job ||--o{ SavedJob : "saved by"
    Job ||--o{ JobView : "viewed by"
    Job ||--o| Payment : "has"
    Job }o--|| Category : "belongs to"
    Job }o--o| Location : "located in"

    %% Category relationships
    Category ||--o{ CategoryTranslation : "has"
    Category ||--o{ Category : "parent of"

    %% Location relationships
    Location ||--o{ Location : "parent of"

    %% File relationships
    File ||--o{ UserProfile : "CV for"
    File ||--o{ Organization : "logo for"
    File ||--o{ Application : "CV for"
```

## Entity Summary

| Entity | Description |
|--------|-------------|
| **Tenant** | Country-specific platform instance |
| **User** | End user (job seeker) or client (employer) |
| **UserProfile** | Extended profile for job seekers |
| **Session** | Active login session with device/IP tracking |
| **RefreshToken** | JWT refresh token tied to a session |
| **Organization** | Employer company/organization |
| **Job** | Job listing posted by organization |
| **Application** | Job application (anonymous or registered) |
| **JobView** | Tracks job views by registered users |
| **Category** | Job category (hierarchical, translatable) |
| **Location** | Geographic location (hierarchical, per tenant) |
| **Payment** | Payment record for job posting |
| **File** | Uploaded files (CVs, logos) |

## Key Relationships

- **Tenant → Everything**: All data is tenant-scoped
- **User → Sessions**: One user can have multiple active sessions
- **Session → RefreshToken**: Each session has one refresh token (cascade delete)
- **User ↔ Organization**: Clients belong to organizations (optional)
- **Organization → Jobs**: One org can post many jobs
- **Job → Applications**: One job receives many applications
- **Application → User**: Optional link (supports anonymous)
- **Category/Location**: Self-referential for hierarchy
