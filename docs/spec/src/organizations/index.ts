import { RelationshipClass, StepSpec } from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from '../../../../src/config';

export const organizationsSpec: StepSpec<IntegrationConfig>[] = [
  {
    /**
     * ENDPOINT: https://console.runzero.com/api/v1.0/account/orgs
     * PATTERN: Fetch Entities
     */
    id: 'fetch-organization',
    name: 'Fetch Organizations Details',
    entities: [
      {
        resourceName: 'Organization',
        _type: 'runzero_organization',
        _class: ['Organization'],
      },
    ],
    relationships: [
      {
        _type: 'runzero_account_has_organization',
        sourceType: 'runzero_account',
        _class: RelationshipClass.HAS,
        targetType: 'runzero_organization',
      },
    ],
    dependsOn: ['fetch-account'],
    implemented: true,
  },
];
