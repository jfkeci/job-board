- docs/ai-task-execution-workflow.md
- docs/prompts/template-prompt.md
- docs/prompts/00-prompt-header-reference.md

context
- docs/initial/er-diagram.md.

refine a prompts form this 

need a db package for backend apps.
it should contain a typeorm config service for establishing a connection.
it should use config service package for env variables.
setup variables for local dev.
it should use eslint backend config.
get typeorm config method should be added to config service.
also need a database service that will encapsulate the repositories (facade pattern) and allow me to use them without injecting them inside my backend services.
export the typeorm config service and the database service from the package