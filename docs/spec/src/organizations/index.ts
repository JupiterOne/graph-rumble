import { RelationshipClass, StepSpec } from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from '../../../../src/config';

export const organizationsSpec: StepSpec<IntegrationConfig>[] = [
  {
    /**
     * ENDPOINT: https://console.rumble.run/api/v1.0/account/orgs
     * PATTERN: Fetch Entities
     */
    id: 'fetch-organization',
    name: 'Fetch Organizations Details',
    entities: [
      {
        resourceName: 'Organization',
        _type: 'rumble_organization',
        _class: ['Organization'],
      },
    ],
    relationships: [
      {
        _type: 'rumble_account_has_organization',
        sourceType: 'rumble_account',
        _class: RelationshipClass.HAS,
        targetType: 'rumble_organization',
      },
    ],
    dependsOn: ['fetch-account'],
    implemented: true,
  },
];
