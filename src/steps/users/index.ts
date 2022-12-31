import {
  createDirectRelationship,
  Entity,
  getRawData,
  IntegrationStep,
  IntegrationStepExecutionContext,
  RelationshipClass,
} from '@jupiterone/integration-sdk-core';
import { createAPIClient } from '../../client';
import { IntegrationConfig } from '../../config';
import { RunZeroUser } from '../../types';
import { ACCOUNT_ENTITY_KEY } from '../account';
import { Entities, Relationships, Steps } from '../constants';
import { createUserEntity } from './converter';

async function fetchUserDetails({
  instance,
  jobState,
  logger,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient({
    instance,
    name: instance.name,
    logger: logger,
  });
  const accountEntity = (await jobState.getData(ACCOUNT_ENTITY_KEY)) as Entity;

  await apiClient.iterateUsers(async (user: RunZeroUser) => {
    const userEntity = await jobState.addEntity(createUserEntity(user));
    // Needed in the buildUserOrganizationRelationships
    await jobState.addRelationship(
      createDirectRelationship({
        from: accountEntity,
        to: userEntity,
        _class: RelationshipClass.HAS,
      }),
    );
  });
}

async function buildUserOrganizationRelationships({
  jobState,
  logger,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  await jobState.iterateEntities(
    { _type: Entities.USER._type },
    async (userEntity) => {
      const user = getRawData<RunZeroUser>(userEntity);

      for (const [orgId, assignedRole] of Object.entries(
        user?.org_roles || {},
      )) {
        const orgEntity = await jobState.findEntity(orgId);
        if (!orgEntity) {
          logger.warn(
            { userId: user?.id, assignedRole, orgId },
            'Could not locate orgId from user org_roles property',
          );
          continue;
        }

        await jobState.addRelationship(
          createDirectRelationship({
            from: userEntity,
            to: orgEntity,
            _class: RelationshipClass.ASSIGNED,
            properties: { assignedRole: assignedRole as string },
          }),
        );
      }
    },
  );
}

export const userSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.USERS,
    name: 'Fetch User Details',
    entities: [Entities.USER],
    relationships: [Relationships.ACCOUNT_HAS_USER],
    dependsOn: [Steps.ACCOUNT],
    executionHandler: fetchUserDetails,
  },
  {
    id: Steps.BUILD_USER_ORGANIZATION_RELATIONSHIPS,
    name: 'Build User Organization Relationships',
    entities: [],
    relationships: [Relationships.USER_ASSIGNED_ORGANIZATION],
    dependsOn: [Steps.USERS, Steps.ORGANIZATION],
    executionHandler: buildUserOrganizationRelationships,
  },
];
