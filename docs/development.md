# Development

### Documentation & References:

- [runZero API Documentation on Swagger](https://app.swaggerhub.com/apis/runZero/runZero)
- [runZero OpenAPI Specification](https://github.com/runZeroInc/runzero-api)
- [runZero Documentation and User Guides](https://www.runzero.com/docs/#download-rumble-documentation-for-offline-use)

## Prerequisites

An Enterprise Licensed Account is required for the runZero Integration to access
`/account` endpoints.

## Provider account setup

If you have an Enterprise Licensed Account, then the
[Getting Started Guide](https://www.runzero.com/docs/getting-started/) that
runZero provides walks through basic User, Organization, and Explorer setup.

## Authentication

runZero uses
[Bearer Authentication](https://swagger.io/docs/specification/authentication/bearer-authentication/)
for authenticating requests.

An **Account API Key** is needed to authenticate with the runZero API.

The process for generating an Account Key is as follows:

1. Navigate to the [runZero Console](https://console.runzero.com/)
2. In the navigation bar, navigate to **Account**
3. At the bottom of the page, use the **Generate API Key** button to create a
   new **Account API Key**
4. Using the .env.example file in the root directory of this project as a
   template, create a new .env file
5. Use your generated **Account API Key** in the **ACCOUNT_API_KEY** field in
   the .env file

You'll need to generate an **Export Token** for each organization whose assets,
services, and wireless data you want to include in the graph. The integration
will automatically collect these tokens if they are present. Organizations
without export tokens will not have assets, services, or wireless data ingested.

1. Navigate to the [runZero Console](https://console.runzero.com/)
2. In the navigation bar, go to `Organizations`
3. Click on the organization in which you want to create an `Export Token`
4. Press the **Generate Export Token** button.
5. Repeat for all organizations whose data you want to ingest.
