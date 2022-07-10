import {
  createIntegrationEntity,
  Entity,
} from '@jupiterone/integration-sdk-core';

// TODO: placeholder
export function createServiceEntity(service: any): Entity {
  return createIntegrationEntity({
    entityData: {
      source: service,
      assign: {
        _key: service.service_id,
        name: service.Field1,
        displayName: service.Field2,
        _class: ['Record'],
        _type: 'rumble_service',
      },
    },
  });
}
