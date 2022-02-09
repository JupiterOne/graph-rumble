import {
  createDirectRelationship,
  Entity,
  IntegrationMissingKeyError,
  IntegrationStep,
  IntegrationStepExecutionContext,
  RelationshipClass,
} from '@jupiterone/integration-sdk-core';
import { createAPIClient } from '../../client';
import { IntegrationConfig } from '../../config';
import { RumbleOrganization } from '../../types';
import { ACCOUNT_ENTITY_KEY } from '../account';
import { Entities, Relationships, Steps } from '../constants';
import { createOrganizationEntity } from './converter';

export async function fetchOrganizationDetails({
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
  if (!accountEntity) {
    throw new IntegrationMissingKeyError(
      `Expected to find Account Entity in jobState with key: ${ACCOUNT_ENTITY_KEY}`,
    );
  }
  await apiClient.iterateOrganizations(async (org: RumbleOrganization) => {
    const orgEntity = await jobState.addEntity(createOrganizationEntity(org));
    // build the relationships between the organizations and account
    await jobState.addRelationship(
      createDirectRelationship({
        _class: RelationshipClass.HAS,
        from: accountEntity,
        to: orgEntity,
      }),
    );
  });
}

export const organizationsSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.ORGANIZATION,
    name: 'Fetch Organizations Details',
    entities: [Entities.ORGANIZATION],
    relationships: [Relationships.ACCOUNT_HAS_ORGANIZATION],
    dependsOn: [Steps.ACCOUNT],
    executionHandler: fetchOrganizationDetails,
  },
];
