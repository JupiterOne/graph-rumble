import { Entity } from '@jupiterone/integration-sdk-core';
import { Role, RoleLevel, RumbleUser } from '../../types';
import { deriveUserRole, greaterRole } from './util';

/**
 * Tests for the user role assignment logic
 */
describe('User Role Assignment Test', () => {
  const USER_ROLES = ['none', 'viewer', 'annotator', 'user', 'admin'];

  describe('#greaterRole', () => {
    test('should rank none lowest', () => {
      for (const role of USER_ROLES) {
        if (role !== 'none') {
          expect(greaterRole(role as Role, 'none')).toBe(role);
        }
      }
    });

    test('should rank admin highest', () => {
      for (const role of USER_ROLES) {
        if (role !== 'admin') {
          expect(greaterRole(role as Role, 'admin')).toBe('admin');
        }
      }
    });

    test('should have correct order of roles', () => {
      expect(
        RoleLevel.none < RoleLevel.viewer &&
          RoleLevel.viewer < RoleLevel.annotator &&
          RoleLevel.annotator < RoleLevel.user &&
          RoleLevel.user < RoleLevel.admin,
      ).toBe(true);
    });
  });

  describe('#deriveUserRole', () => {
    test('should always promote to admin when user is client_admin', () => {
      const user: RumbleUser = {
        id: 'test-id',
        client_id: 'test-client-id',
        created_at: 0,
        updated_at: 0,
        first_name: 'first',
        last_name: 'last',
        email: 'first.last@example.com',
        // true for this test to work
        client_admin: true,
        // no default role is a possible response we test
        org_default_role: '',
        org_roles: {},
        reset_token_expiration: 0,
        invite_token_expiration: 0,
        last_login_ip: '127.0.0.1',
        last_login_at: 0,
        last_login_ua: 'test-agent',
        last_activity_at: 0,
        sso_only: false,
        login_failures: 0,
        actions: 0,
        last_action_at: 0,
      };

      const org: Entity = {
        _key: 'test-id',
        _type: 'rumble_organization',
        _class: ['Organization'],
      };

      // even with no data on org_default_role and org_roles
      // user should be admin if client_admin === true
      expect(deriveUserRole(user, org)).toBe('admin');

      // assign each role and test if user is still admin
      for (const role of USER_ROLES) {
        user.org_default_role = role as Role;
        expect(deriveUserRole(user, org)).toBe('admin');
      }

      // reset user to no access
      user.org_default_role = 'none';
      // set org specific role
      user.org_roles['test-id'] = 'none';

      // assign each role to org specific role and test if user is still admin
      for (const role of USER_ROLES) {
        user.org_roles['test-id'] = role as Role;
        expect(deriveUserRole(user, org)).toBe('admin');
      }
    });
  });
});
