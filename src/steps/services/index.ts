import {
  IntegrationStep,
  IntegrationStepExecutionContext,
} from '@jupiterone/integration-sdk-core';
import { createAPIClient } from '../../client';
import { IntegrationConfig } from '../../config';
import { Steps } from '../constants';
import { createServiceEntity } from './converter';

export const servicesStep: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.SERVICES,
    name: 'Fetch Services',
    entities: [],
    relationships: [],
    mappedRelationships: [],
    dependsOn: [],
    executionHandler: fetchServices,
  },
];

async function fetchServices({
  instance,
  jobState,
  logger,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const client = createAPIClient({
    logger,
    name: instance.name,
    config: instance.config,
  });

  await client.iterateServices(async (service) => {
    await jobState.addEntity(createServiceEntity(service));
  });
}
