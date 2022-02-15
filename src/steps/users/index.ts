import {
  createDirectRelationship,
  Entity,
  IntegrationStep,
  IntegrationStepExecutionContext,
  RelationshipClass,
} from '@jupiterone/integration-sdk-core';
import { createAPIClient } from '../../client';
import { IntegrationConfig } from '../../config';
import { RumbleUser } from '../../types';
import { ACCOUNT_ENTITY_KEY } from '../account';
import { Entities, Relationships, Steps } from '../constants';
import { createUserEntity } from './converter';

export async function fetchUserDetails({
  instance,
  jobState,
  logger,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient({
    config: instance.config,
    name: instance.name,
    logger: logger,
  });

  await apiClient.iterateUsers(async (user: RumbleUser) => {
    await jobState.addEntity(createUserEntity(user));
    // Needed in the buildUserOrganizationRelationships
    await jobState.setData(user.id, user.org_roles);
  });
}

export async function buildUserOrganizationRelationships({
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const userFilter = { _type: Entities.USER._type };
  const orgFilter = { _type: Entities.ORGANIZATION._type };

  await jobState.iterateEntities(userFilter, async (userEntity) => {
    const assignedRoles: Object | null | undefined = await jobState.getData(
      userEntity._key,
    );
    await jobState.iterateEntities(orgFilter, async (orgEntity) => {
      let assignedRole: string | undefined;
      if (assignedRoles !== null && typeof assignedRoles === 'object') {
        if (orgEntity._key in assignedRoles) {
          // roles are keyed by the organization id
          assignedRole = assignedRoles[orgEntity._key];
        }
      }

      await jobState.addRelationship(
        createDirectRelationship({
          from: userEntity,
          to: orgEntity,
          _class: RelationshipClass.ASSIGNED,
          properties: {
            defaultRole:
              typeof userEntity.orgDefaultRole === 'string'
                ? userEntity.orgDefaultRole
                : undefined,
            assignedRole: assignedRole,
          },
        }),
      );
    });
  });
}

export async function buildAccountUserRelationships({
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const userFilter = { _type: Entities.USER._type };
  const accountEntity = (await jobState.getData(ACCOUNT_ENTITY_KEY)) as Entity;
  await jobState.iterateEntities(userFilter, async (userEntity) => {
    await jobState.addRelationship(
      createDirectRelationship({
        from: accountEntity,
        to: userEntity,
        _class: RelationshipClass.HAS,
      }),
    );
  });
}

export const userSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.USERS,
    name: 'Fetch User Details',
    entities: [Entities.USER],
    relationships: [],
    dependsOn: [Steps.ACCOUNT, Steps.ORGANIZATION],
    executionHandler: fetchUserDetails,
  },
  {
    id: Steps.BUILD_USER_ORGANIZATION_RELATIONSHIPS,
    name: 'Build User Organization Relationships',
    entities: [],
    relationships: [Relationships.USER_ASSIGNED_ORGANIZATION],
    dependsOn: [Steps.USERS],
    executionHandler: buildUserOrganizationRelationships,
  },
  {
    id: Steps.BUILD_ACCOUNT_USER_RELATIONSHIPS,
    name: 'Build Account User Relationships',
    entities: [],
    relationships: [Relationships.ACCOUNT_HAS_USER],
    dependsOn: [Steps.USERS],
    executionHandler: buildAccountUserRelationships,
  },
];
