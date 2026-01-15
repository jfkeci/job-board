- docs/ai-task-execution-workflow.md
- docs/prompts/template-prompt.md
- docs/prompts/00-prompt-header-reference.md

context
- docs/initial/er-diagram.md
- packages/db/src/database.service.ts

refine a comprehensive prompt form this 

- [ ] **Auth Module (API)**
  - [ ] Implement JWT authentication with access/refresh tokens
  - [ ] Create auth controller endpoints:
    - `POST /auth/register` - User registration
    - `POST /auth/login` - User login (returns tokens)
  - [ ] Implement password hashing (bcrypt/argon2)
  - [ ] Create AuthGuard for protected routes
  - [ ] Implement role-based access control (RBAC) with `UserRole` enum
  - [ ] Session management service (create, track, expire)
  - [ ] RefreshToken rotation logic

for now, i don't need email verification.