import {
  IntegrationStep,
  IntegrationStepExecutionContext,
} from '@jupiterone/integration-sdk-core';
import { createAPIClient } from '../../client';

import { IntegrationConfig } from '../../config';
import { Steps, Entities } from '../constants';
import { createAccountEntity } from './converter';

// account key will be used in later steps to retrieve the account entity
export const ACCOUNT_ENTITY_KEY = 'entity:account';

export async function fetchAccountDetails({
  instance,
  jobState,
  logger,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient({
    instance,
    name: instance.name,
    logger: logger,
  });

  const account = await apiClient.getAccount();
  const accountEntity = await jobState.addEntity(createAccountEntity(account));

  // set a lookup for the accountEntity to be used
  // in later steps for building relationships
  await jobState.setData(ACCOUNT_ENTITY_KEY, accountEntity);
}

export const accountSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.ACCOUNT,
    name: 'Fetch Account Details',
    entities: [Entities.ACCOUNT],
    relationships: [],
    dependsOn: [],
    executionHandler: fetchAccountDetails,
  },
];
