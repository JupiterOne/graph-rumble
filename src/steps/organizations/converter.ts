import {
  createIntegrationEntity,
  Entity,
} from '@jupiterone/integration-sdk-core';
import { RumbleOrganization } from '../../types';
import { Entities } from '../constants';

export function createOrganizationEntity(org: RumbleOrganization): Entity {
  return createIntegrationEntity({
    entityData: {
      // for source we could pull in all the non-secret fields
      source: {
        id: org.id,
        name: org.name,
      },
      assign: {
        _key: org.id,
        _type: Entities.ORGANIZATION._type,
        _class: Entities.ORGANIZATION._class,
        name: org.name,
        displayName: org.name,
      },
    },
  });
}
