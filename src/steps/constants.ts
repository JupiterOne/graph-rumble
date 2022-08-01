import {
  RelationshipClass,
  StepEntityMetadata,
  StepRelationshipMetadata,
} from '@jupiterone/integration-sdk-core';

export const Steps = {
  ACCOUNT: 'fetch-account',
  USERS: 'fetch-users',
  ORGANIZATION: 'fetch-organization',
  BUILD_USER_ORGANIZATION_RELATIONSHIPS:
    'build-user-organization-relationships',
  SITES: 'fetch-sites',
  BUILD_ORGANIZATION_SITE_RELATIONSHIPS:
    'build-organization-site-relationships',
  ASSETS: 'fetch-assets',
  BUILD_SITE_ASSET_RELATIONSHIPS: 'build-site-asset-relationships',
  BUILD_ACCOUNT_SITE_RELATIONSHIPS: 'build-site-account-relationships',
};

export const Entities: Record<
  'ACCOUNT' | 'ORGANIZATION' | 'USER' | 'SITE' | 'ASSET',
  StepEntityMetadata
> = {
  ACCOUNT: {
    resourceName: 'Account',
    _type: 'rumble_account',
    _class: ['Account'],
    schema: {
      additionalProperties: true,
      properties: {
        _type: { const: 'rumble_account' },
        _key: { type: 'string' },
        name: { type: 'string' },
        displayName: { type: 'string' },
        createdOn: { type: 'number' },
        createdBy: { type: 'string' },
        updatedOn: { type: 'number' },
        updatedBy: { type: 'string' },
        _rawData: {
          type: 'array',
          items: { type: 'object' },
        },
      },
      required: [],
    },
  },
  ORGANIZATION: {
    resourceName: 'Organization',
    _type: 'rumble_organization',
    _class: ['Organization'],
    schema: {
      additionalProperties: true,
      properties: {
        _type: { const: 'rumble_organization' },
        _key: { type: 'string' },
        name: { type: 'string' },
        displayName: { type: 'string' },
        createdOn: { type: 'number' },
        createdBy: { type: 'string' },
        updatedOn: { type: 'number' },
        updatedBy: { type: 'string' },
        // description is a nullable property
        description: { type: ['string', 'null'] },
        _rawData: {
          type: 'array',
          items: { type: 'object' },
        },
      },
      required: ['_type', '_key', 'name'],
    },
  },
  USER: {
    resourceName: 'User',
    _type: 'rumble_user',
    _class: ['User'],
    schema: {
      additionalProperties: true,
      properties: {
        _type: { const: 'rumble_user' },
        _key: { type: 'string' },
        name: { type: 'string' },
        displayName: { type: 'string' },
        createdOn: { type: 'number' },
        createdBy: { type: 'string' },
        updatedOn: { type: 'number' },
        updatedBy: { type: 'string' },
        _rawData: {
          type: 'array',
          items: { type: 'object' },
        },
      },
      required: [],
    },
  },
  SITE: {
    resourceName: 'Site',
    _type: 'rumble_site',
    _class: ['Site'],
    schema: {
      additionalProperties: true,
      properties: {
        _type: { const: 'rumble_site ' },
        _key: { type: 'string' },
        name: { type: 'string' },
        displayName: { type: 'string' },
        createdOn: { type: 'number' },
        createdBy: { type: 'string' },
        updatedOn: { type: 'number' },
        updatedBy: { type: 'string' },
        _rawData: {
          type: 'array',
          items: { type: 'object' },
        },
      },
      required: ['_type', '_key', 'name', 'displayName'],
    },
  },
  ASSET: {
    resourceName: 'Asset',
    _type: 'rumble_asset',
    _class: ['Device'],
    schema: {
      additionalProperties: true,
      properties: {
        _type: { const: 'rumble_asset' },
        _key: { type: 'string' },
        name: { type: 'string' },
        displayName: { type: 'string' },
        createdOn: { type: 'number' },
        createdBy: { type: 'string' },
        updatedOn: { type: 'number' },
        updatedBy: { type: 'string' },
        _rawData: {
          type: 'array',
          items: { type: 'object' },
        },
      },
      required: ['_type', '_key', 'name', 'displayName'],
    },
  },
};

export const Relationships: Record<
  | 'ACCOUNT_HAS_USER'
  | 'ACCOUNT_HAS_ORGANIZATION'
  | 'USER_ASSIGNED_ORGANIZATION'
  | 'ORGANIZATION_HAS_SITE'
  | 'SITE_HAS_ASSET'
  | 'ACCOUNT_HAS_SITE',
  StepRelationshipMetadata
> = {
  ACCOUNT_HAS_USER: {
    _type: 'rumble_account_has_user',
    sourceType: Entities.ACCOUNT._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.USER._type,
  },
  ACCOUNT_HAS_ORGANIZATION: {
    _type: 'rumble_account_has_organization',
    sourceType: Entities.ACCOUNT._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.ORGANIZATION._type,
  },
  USER_ASSIGNED_ORGANIZATION: {
    _type: 'rumble_user_assigned_organization',
    sourceType: Entities.USER._type,
    _class: RelationshipClass.ASSIGNED,
    targetType: Entities.ORGANIZATION._type,
    schema: {
      properties: {
        assignedRole: { type: 'string' },
      },
    },
  },
  ORGANIZATION_HAS_SITE: {
    _type: 'rumble_organization_has_site',
    sourceType: Entities.ORGANIZATION._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.SITE._type,
  },
  SITE_HAS_ASSET: {
    _type: 'rumble_site_has_asset',
    sourceType: Entities.SITE._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.ASSET._type,
  },
  ACCOUNT_HAS_SITE: {
    sourceType: Entities.ACCOUNT._type,
    targetType: Entities.SITE._type,
    _type: 'rumble_account_has_site',
    _class: RelationshipClass.HAS,
  },
};
