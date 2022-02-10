import { Entity } from '@jupiterone/integration-sdk-core';
import { Role, RoleLevel, RumbleUser } from '../../types';

export function deriveUserRole(user: RumbleUser, org: Entity): Role {
  // if a user is an account/client admin they are also an org admin
  if (user.client_admin === true) {
    return 'admin';
  }

  // TODO rework this. This a type guard, but mutates it
  // I believe that all cases where org_default_role is '' client_admin will be
  // true, but can't confirm 100% just yet
  if (user.org_default_role === '') {
    return 'none';
  }

  // check to see if the user has special permissions for this organization
  if (org._key in user.org_roles) {
    return greaterRole(user.org_default_role, user.org_roles[org._key]);
  }
  return user.org_default_role;
}

export function greaterRole(roleA: Role, roleB: Role): Role {
  return RoleLevel[roleA] > RoleLevel[roleB] ? roleA : roleB;
}
