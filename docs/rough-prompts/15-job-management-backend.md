- docs/ai-task-execution-workflow.md
- docs/prompts/template-prompt.md
- docs/prompts/00-prompt-header-reference.md
- docs/references/http-exceptions-usage.md
- docs/references/swagger-documentation-usage.md

refine a comprehensive prompt form this 

need backend functionality for this
Jobs Module (API)
[ ] Jobs controller (employer):
POST /jobs - Create job draft
GET /jobs - List organization's jobs
GET /jobs/:id - Get job details
PATCH /jobs/:id - Update job
DELETE /jobs/:id - Delete job
POST /jobs/:id/publish - Publish job (triggers payment)
POST /jobs/:id/close - Close job listing
POST /jobs/:id/extend - Extend expiration

i expect b2b clients to be able to manage job listings for their organization