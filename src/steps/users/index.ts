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
import { deriveUserRole } from './util';

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
  const accountEntity = (await jobState.getData(ACCOUNT_ENTITY_KEY)) as Entity;

  await apiClient.iterateUsers(async (user: RumbleUser) => {
    const userEntity = await jobState.addEntity(createUserEntity(user));

    await jobState.addRelationship(
      createDirectRelationship({
        _class: RelationshipClass.HAS,
        from: accountEntity,
        to: userEntity,
      }),
    );

    await jobState.iterateEntities(
      { _type: Entities.ORGANIZATION._type },
      async (orgEntity) => {
        const opts = {
          _class: RelationshipClass.ASSIGNED,
          from: userEntity,
          to: orgEntity,
          properties: {
            role: deriveUserRole(user, orgEntity),
          },
        };
        await jobState.addRelationship(createDirectRelationship(opts));
      },
    );
  });
}

export const userSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.USERS,
    name: 'Fetch User Details',
    entities: [Entities.USER],
    relationships: [
      Relationships.USER_ASSIGNED_ORGANIZATION,
      Relationships.ACCOUNT_HAS_USER,
    ],
    dependsOn: [Steps.ACCOUNT, Steps.ORGANIZATION],
    executionHandler: fetchUserDetails,
  },
];
