import {
  createIntegrationEntity,
  Entity,
} from '@jupiterone/integration-sdk-core';
import { RunZeroAccount } from '../../types';

import { Entities } from '../constants';
export function createAccountEntity(account: RunZeroAccount): Entity {
  return createIntegrationEntity({
    entityData: {
      source: {
        id: account.id,
        name: account.name,
      },
      assign: {
        _key: account.id,
        _type: Entities.ACCOUNT._type,
        _class: Entities.ACCOUNT._class,
        name: account.name,
        displayName: account.name,
      },
    },
  });
}
