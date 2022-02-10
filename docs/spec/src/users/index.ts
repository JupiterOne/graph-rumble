import { RelationshipClass, StepSpec } from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from '../../../../src/config';

export const organizationSpec: StepSpec<IntegrationConfig>[] = [
  {
    /**
     * ENDPOINT: https://console.rumble.run/api/v1.0/account/users
     * PATTERN: Fetch Entities
     */
    id: 'fetch-users',
    name: 'Fetch User Details',
    entities: [
      {
        resourceName: 'User',
        _type: 'rumble_user',
        _class: ['User'],
      },
    ],
    relationships: [
      {
        /**
         * TODO can we add properties to test in the spec
         */
        _type: 'rumble_user_assigned_organization',
        sourceType: 'rumble_user',
        _class: RelationshipClass.ASSIGNED,
        targetType: 'rumble_organization',
      },
      {
        _type: 'rumble_account_has_user',
        sourceType: 'rumble_account',
        _class: RelationshipClass.HAS,
        targetType: 'rumble_organization',
      },
    ],
    dependsOn: ['fetch-account', 'fetch-organization'],
    implemented: true,
  },
];
