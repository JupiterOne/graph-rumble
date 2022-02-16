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
    relationships: [],
    dependsOn: ['fetch-organization'],
    implemented: true,
  },
  {
    id: 'build-organization-site-relationships',
    name: 'Build Organization Site Relationships',
    entities: [],
    relationships: [
      {
        _type: 'rumble_organization_has_site',
        sourceType: 'rumble_organization',
        _class: RelationshipClass.HAS,
        targetType: 'rumble_site',
      },
    ],
    dependsOn: ['fetch-sites'],
    implemented: true,
  },
];
