# Integration with JupiterOne

## runZero + JupiterOne Integration Benefits

- Visualize your runZero organizations, users, and scanned assets and services
  in the JupiterOne graph.
- Map runZero users to employees in your JupiterOne account.
- Monitor changes to runZero users using JupiterOne alerts.
- Discover which assets in your network are running a vulnerable OS

## How it Works

- JupiterOne periodically fetches organizations, users, assets, and other
  entities from runZero to update the graph.
- Write JupiterOne queries to review and monitor updates to the graph, or
  leverage existing queries.
- Configure alerts to take action when the JupiterOne graph changes, or leverage
  existing alerts.

## Requirements

You can configure the runZero Integration using either an **Account API Key** or
a single **Export Token**. The **Export Token** has more limited read-only
permissions, but will limit the data collected.

### Using an Account API Key

- JupiterOne integration requires a runZero **Account API Key**. To generate an
  **Account API Key** you'll need:

  - runZero Enterprise License
  - Administrator access

- JupiterOne integration also requires an **Export Token** for each organization
  whose asset, services, and wireless data you want to include. To generate an
  **Export Token** you'll need:

  - Admin access to the organization for which you want to generate an **Export
    Token**

- You must have permission in JupiterOne to install new integrations.

### Using an Export Token

If you are configuring the integration using an **Export Token**, you'll need:

- Admin access to the runZero organization for which you want to generate an
  **Export Token**.
- You must have permission in JupiterOne to install new integrations.

## Support

If you need help with this integration, please contact
[JupiterOne Support](https://support.jupiterone.io).

## Integration Walkthrough

You'll need an **Account API Key** and administrator access to the account to
integrate with JupiterOne. You'll also need to generate **Export Tokens** for
all organizations whose data you want to ingest.

### In runZero

#### Configuring Using An Account API Key

**Account API Key Generation**

1. Navigate to the [runZero Console](https://console.runzero.com/).
2. In the navigation bar, go to `Account`
3. On the Account page under the Account API keys section, click "Generate API
   Key"
4. A new **Account API Key** will be created. This key will be used in the next
   section.

**Export Token Generation**

You'll need to generate an export token for each organization whose assets,
services, and wireless data you want to include in the graph. The integration
will automatically collect these tokens if they are present. Organizations
without export tokens will not have assets, services, or wireless data ingested.

1. Navigate to the [runZero Console](https://console.runzero.com/)
2. In the navigation bar, go to `Organizations`
3. Click on the organization in which you want to create an `Export Token`
4. Press the **Generate Export Token** button.
5. Repeat for all organizations whose data you want to ingest.

#### Configuring Using An Export Token

You'll need to generate an export token for the organization whose data you want
to ingest.

1. Navigate to the [runZero Console](https://console.runzero.com/)
2. In the navigation bar, go to `Organizations`
3. Click on the organization in which you want to create an `Export Token`
4. Press the **Generate Export Token** button.
5. Copy your `Export Token` for use in JupiterOne

### In JupiterOne

1. From the configuration **Gear Icon**, select **Integrations**.
2. Scroll to the **runZero** integration tile and click it.
3. Click the **Add Configuration** button and configure the following settings:

- Enter the **Account Name** by which you'd like to identify this runZero
  account in JupiterOne. Ingested entities will have this value stored in
  `tag.AccountName` when **Tag with Account Name** is checked.
- Enter a **Description** that will further assist your team when identifying
  the integration instance.
- Select a **Polling Interval** that you feel is sufficient for your monitoring
  needs. You may leave this as `DISABLED` and manually execute the integration.
- If you're configuring the integration with an `Account API Key` then put the
  key in the `runZero Account API Key` box. If you are configuring the
  integration with an Export Token put the token into the `Export Token` box.

4. Click **Create Configuration** once all values are provided.

## How to Uninstall

1. From the configuration **Gear Icon**, select **Integrations**.
2. Scroll to the **runZero** integration tile and click it.
3. Identify and click the **integration to delete**.
4. Click the **trash can** icon.
5. Click the **Remove** button to delete the integration.

<!-- {J1_DOCUMENTATION_MARKER_START} -->
<!--
********************************************************************************
NOTE: ALL OF THE FOLLOWING DOCUMENTATION IS GENERATED USING THE
"j1-integration document" COMMAND. DO NOT EDIT BY HAND! PLEASE SEE THE DEVELOPER
DOCUMENTATION FOR USAGE INFORMATION:

https://github.com/JupiterOne/sdk/blob/main/docs/integrations/development.md
********************************************************************************
-->

## Data Model

### Entities

The following entities are created:

| Resources    | Entity `_type`        | Entity `_class` |
| ------------ | --------------------- | --------------- |
| Account      | `rumble_account`      | `Account`       |
| Asset        | `rumble_asset`        | `Device`        |
| Organization | `rumble_organization` | `Organization`  |
| Site         | `rumble_site`         | `Site`          |
| User         | `rumble_user`         | `User`          |

### Relationships

The following relationships are created:

| Source Entity `_type` | Relationship `_class` | Target Entity `_type` |
| --------------------- | --------------------- | --------------------- |
| `rumble_account`      | **HAS**               | `rumble_organization` |
| `rumble_account`      | **HAS**               | `rumble_site`         |
| `rumble_account`      | **HAS**               | `rumble_user`         |
| `rumble_organization` | **HAS**               | `rumble_site`         |
| `rumble_site`         | **HAS**               | `rumble_asset`        |
| `rumble_user`         | **ASSIGNED**          | `rumble_organization` |

<!--
********************************************************************************
END OF GENERATED DOCUMENTATION AFTER BELOW MARKER
********************************************************************************
-->
<!-- {J1_DOCUMENTATION_MARKER_END} -->
