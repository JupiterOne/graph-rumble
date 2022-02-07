import {
  createDirectRelationship,
  Entity,
  IntegrationStep,
  IntegrationStepExecutionContext,
  RelationshipClass,
} from '@jupiterone/integration-sdk-core';
import { createAPIClient } from '../../client';
import { IntegrationConfig } from '../../config';
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

  const organizations = await apiClient.getOrganizations();
  const accountEntity = (await jobState.getData(ACCOUNT_ENTITY_KEY)) as Entity;

  // build the relationships between the organizations and account
  for (const org of organizations) {
    const orgEntity = await jobState.addEntity(createOrganizationEntity(org));
    const opts = {
      _class: RelationshipClass.HAS,
      from: accountEntity,
      to: orgEntity,
    };
    await jobState.addRelationship(createDirectRelationship(opts));
  }
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
