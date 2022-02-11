import { RelationshipClass, StepSpec } from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from '../../../../src/config';

export const organizationsSpec: StepSpec<IntegrationConfig>[] = [
  {
    /**
     * ENDPOINT: https://console.rumble.run/api/v1.0/account/sites
     * PATTERN: Fetch Entities
     */
    id: 'fetch-sites',
    name: 'Fetch Sites Details',
    entities: [
      {
        resourceName: 'Site',
        _type: 'rumble_site',
        _class: ['Site'],
      },
    ],
    relationships: [
      {
        _type: 'rumble_organization_has_site',
        sourceType: 'rumble_organization',
        _class: RelationshipClass.HAS,
        targetType: 'rumble_site',
      },
    ],
    dependsOn: ['fetch-organization'],
    implemented: false,
  },
];
