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
      assign: createAssignObject(user),
    },
  });
}

function createAssignObject(user: RumbleUser) {
  let name: string | undefined = undefined;
  if (user.first_name && user.last_name) {
    name = user.first_name + user.last_name;
  } else if (user.first_name) {
    name = user.first_name;
  } else if (user.last_name) {
    name = user.last_name;
  }

  return {
    _key: user.id,
    _type: Entities.USER._type,
    _class: Entities.USER._class,
    name: name,
    displayName: name,
    // okay for properties to be undefined, but not okay to be null
    firstName: user.first_name ?? undefined,
    lastName: user.last_name ?? undefined,
    username: user.email ?? undefined,
    email: user.email ?? undefined,
    orgDefaultRole: user.org_default_role ?? undefined,
    resetTokenExpiration: user.reset_token_expiration,
    inviteTokenExpiration: user.invite_token_expiration,
    lastLoginIP: user.last_login_ip ?? undefined,
    lastLoginAt: user.last_login_at,
    lastLoginUa: user.last_login_ua ?? undefined,
    lastActivityAt: user.last_activity_at,
    ssoOnly: user.sso_only,
    loginFailures: user.login_failures,
    actions: user.actions,
    lastActionAt: user.last_action_at,
    active: true,
  };
}
