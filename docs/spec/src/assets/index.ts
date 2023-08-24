import { RelationshipClass, StepSpec } from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from '../../../../src/config';

export const assetSpec: StepSpec<IntegrationConfig>[] = [
  {
    id: 'fetch-assets',
    name: 'Fetch Asset Details',
    entities: [
      {
        resourceName: 'Asset',
        _type: 'rumble_asset',
        _class: ['Device'],
      },
    ],
    relationships: [],
    dependsOn: [],
    implemented: true,
  },
  {
    id: 'build-site-asset-relationships',
    name: 'Build Site Asset Relationships',
    entities: [],
    relationships: [
      {
        _type: 'rumble_site_has_asset',
        sourceType: 'rumble_site',
        _class: RelationshipClass.HAS,
        targetType: 'rumble_asset',
      },
    ],
    dependsOn: ['fetch-sites', 'fetch-assets'],
    implemented: true,
  },
];
