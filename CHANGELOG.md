# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed

- Updated endpoints and names referencing `Rumble` to `runZero` as part of the
  rebranding.

[2.0.1] - 2022-09-21

### Changed

- Added `sourcePrecision` parameter to `parseTimePropertyValue` calls.
- Added a space to `displayName` of users
- Bumped SDK dependencies to ^8.24.0

[2.0.0]

### Added

- Added the option to authenticate using an `Export Token`.
  - Added a new ExportToken based client to support the new authentication
    method
- Added new `Account` -HAS-> `Site` relationship
- Added `getStepStartStates` for the different execution flows

### Changed

- Assets step now uses streams to handle response

[1.2.2] - 2022-05-25

Adding new managed question

[1.2.1] - 2022-03-08

### Changed

- The path `src/steps/assets` has been renamed to `src/steps/asset` to avoid
  having the directory removed by common node_modules pruning scripts

[1.2.0] - 2022-03-07

- Added `rumble_asset` type and `ASSETS` and `BUILD_SITE_ASSET_RELATIONSHIPS`
  steps.

[1.1.1] - 2022-02-28

### Removed

- Subnet property removed from `Site` entity to fix error when ingesting objects

[1.1.0] - 2022-02-24

### Added

- Ingest site entities and site relationships
- Ingest user entity and create related relationships

[1.0.1] - 2022-02-14

### Added

- Initial version for development and testing
- Added Account and Organization step
