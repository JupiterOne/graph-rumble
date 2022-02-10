import {
  createIntegrationEntity,
  Entity,
} from '@jupiterone/integration-sdk-core';
import { RumbleUser } from '../../types';
import { Entities } from '../constants';

export function createUserEntity(user: RumbleUser): Entity {
  return createIntegrationEntity({
    entityData: {
      source: user,
      assign: {
        _key: user.id,
        _type: Entities.USER._type,
        _class: Entities.USER._class,
        name: user.first_name + user.last_name,
        firstName: user.first_name,
        lastName: user.last_name,
        username: user.email,
        displayName: user.first_name + user.last_name,
        active: true,
      },
    },
  });
}
