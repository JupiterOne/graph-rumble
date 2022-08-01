import {
  IntegrationExecutionContext,
  IntegrationInfoEventName,
  StepStartStates,
} from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from './config';
import { Steps } from './steps/constants';

export function getStepStartStates({
  instance,
  logger,
}: IntegrationExecutionContext<IntegrationConfig>): StepStartStates {
  if (!instance.config.exportToken) {
    return {
      [Steps.ACCOUNT]: { disabled: false },
      [Steps.USERS]: { disabled: false },
      [Steps.ORGANIZATION]: { disabled: false },
      [Steps.BUILD_USER_ORGANIZATION_RELATIONSHIPS]: { disabled: false },
      [Steps.SITES]: { disabled: false },
      [Steps.BUILD_ORGANIZATION_SITE_RELATIONSHIPS]: { disabled: false },
      [Steps.ASSETS]: { disabled: false },
      [Steps.BUILD_SITE_ASSET_RELATIONSHIPS]: { disabled: false },
      [Steps.BUILD_ACCOUNT_SITE_RELATIONSHIPS]: { disabled: false },
    };
  } else {
    logger.publishInfoEvent({
      name: IntegrationInfoEventName.Stats,
      description:
        'The integration is using an Export Token for data collection. Users and Organizations will not be ingested.',
    });
    return {
      [Steps.ACCOUNT]: { disabled: false },
      [Steps.USERS]: { disabled: true }, // can't fetch users with export tokens
      [Steps.ORGANIZATION]: { disabled: true }, // can't fetch organizations with export tokens
      [Steps.BUILD_USER_ORGANIZATION_RELATIONSHIPS]: { disabled: true }, // above
      [Steps.SITES]: { disabled: false },
      [Steps.BUILD_ORGANIZATION_SITE_RELATIONSHIPS]: { disabled: true }, // above
      [Steps.ASSETS]: { disabled: false },
      [Steps.BUILD_SITE_ASSET_RELATIONSHIPS]: { disabled: false },
      [Steps.BUILD_ACCOUNT_SITE_RELATIONSHIPS]: { disabled: false },
    };
  }
}
