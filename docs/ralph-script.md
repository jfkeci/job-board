
dashboard app (b2b) should be an app for clients
clients should be able to
    - create account or login
    - create and manage their organization
    - create and manage jobs for their organization
    - see job impressions 
    - see job applications


web app users should be able to 
    - access homepage to see homepage (featured) jobs and search for jobs
    - search for jobs
    - login/register
    - manage their profile (cv)
    - apply for jobs
    - web app anon users should also be able to apply to jobs anonymously

there should be an admin web app
    - admin user is provided by the developer
    - admin user should be able to see tables with users, tables with clients
    - admin user should be able to login into web app as user
    - admin user should be able to login into dashbaord as client
    - admin user should be able to manage available categories
    - admin user should be able to manage available locations
    - manage availbale tennants (apps)
    - see job impressions and applications


other
- job views are being tracked
- user searches should be tracked
- anon user searches should be tracked (on the session)

notes
- no need for any document upload or email verification
- frontend apps share ui library
- there needs to be an option to configure the design library for another tennants (another deployments of web applications)
- keep in mind good documentation (docs/references/http-exceptions-usage.md)
- keep in mind good http exception planning (docs/references/swagger-documentation-usage.md)

context (initial rough plans of the app, these are not finite)
- docs/initial/er-diagram.md