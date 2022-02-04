# Development

### Documentation & References:

- [Rumble API Documentation on Swagger](https://app.swaggerhub.com/apis-docs/RumbleDiscovery/Rumble/)
- [Rumble OpenAPI Specification](https://github.com/RumbleDiscovery/rumble-api)
- [Rumble Documentation and User Guides](https://www.rumble.run/docs/#download-rumble-documentation-for-offline-use)

## Prerequisites

An Enterprise Licensed Account is required for the Rumble Integration to access
`/account` endpoints.

## Provider account setup

If you have an Enterprise Licensed Account, then the
[Getting Started Guide](https://www.rumble.run/docs/first-steps/) that Rumble
provides walks through basic User, Organization, and Explorer setup.

## Authentication

Rumble uses
[Bearer Authentication](https://swagger.io/docs/specification/authentication/bearer-authentication/)
for authenticating requests.

An **Account API Key** is needed to authenticate with the Rumble API.

The process for generating an Account Key is as follows:

1. Navigate to the [Rumble Console](htttps://console.rumble.run)
2. In the navigation bar, navigate to **Account**
3. At the bottom of the page, use the **Generate API Key** button to create a
   new **Account API Key**
4. Using the .env.example file in the root directory of this project as a
   template, create a new .env file
5. Use your generated **Account API Key** in the **ACCOUNT_API_KEY** field in
   the .env file
