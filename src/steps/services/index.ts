import {
  IntegrationStep,
  IntegrationStepExecutionContext,
} from '@jupiterone/integration-sdk-core';
import { createAPIClient } from '../../client';
import { IntegrationConfig } from '../../config';
import { Steps } from '../constants';

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
    name: 'test',
    config: instance.config,
  });

  await client.iterateServices(async (service) => {
    console.log('service', service);
  });
}
