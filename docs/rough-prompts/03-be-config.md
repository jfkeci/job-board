- docs/ai-task-execution-workflow.md
- docs/prompts/template-prompt.md
- docs/prompts/00-prompt-header-reference.md

refine a prompts form this 

need a backend config service 
- it should have an interface that defines types for the env variables
- interface should be used by a zod schema used by a config validation service 
it should be a package usable by nestjs backend apps
uses eslint config backend package
it should load env files from inside the package itself
for starters setup env variable and a typeorm mysql connection variables