import { RelationshipClass, StepSpec } from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from '../../../../src/config';

export const usersSpec: StepSpec<IntegrationConfig>[] = [
  {
    /**
     * ENDPOINT: https://console.runzero.com/api/v1.0/account/users
     * PATTERN: Fetch Entities
     */
    id: 'fetch-users',
    name: 'Fetch User Details',
    entities: [
      {
        resourceName: 'User',
        _type: 'runzero_user',
        _class: ['User'],
      },
    ],
    relationships: [
      {
        _type: 'runzero_account_has_user',
        sourceType: 'runzero_account',
        _class: RelationshipClass.HAS,
        targetType: 'runzero_user',
      },
    ],
    dependsOn: ['fetch-account'],
    implemented: true,
  },
  {
    /**
     * ENDPOINT: N/A
     * PATTERN: Build Child Relationships
     */
    id: 'build-user-organization-relationships',
    name: 'Build User Organization Relationships',
    entities: [],
    relationships: [
      {
        _type: 'runzero_user_assigned_organization',
        sourceType: 'runzero_user',
        _class: RelationshipClass.ASSIGNED,
        targetType: 'runzero_organization',
      },
    ],
    dependsOn: ['fetch-users', 'fetch-organization'],
    implemented: true,
  },
];
