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
