import {
  DisabledStepReason,
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
  if (instance.config.exportToken) {
    logger.publishInfoEvent({
      name: IntegrationInfoEventName.Stats,
      description:
        'The integration is using an Export Token for data collection. Users and Organizations will not be ingested.',
    });
    return {
      [Steps.ACCOUNT]: { disabled: false },
      [Steps.USERS]: {
        disabled: true,
        disabledReason: DisabledStepReason.PERMISSION,
      }, // can't fetch users with export tokens
      [Steps.ORGANIZATION]: {
        disabled: true,
        disabledReason: DisabledStepReason.PERMISSION,
      }, // can't fetch organizations with export tokens
      [Steps.BUILD_USER_ORGANIZATION_RELATIONSHIPS]: {
        disabled: true,
        disabledReason: DisabledStepReason.PERMISSION,
      },
      [Steps.SITES]: { disabled: false },
      [Steps.BUILD_ORGANIZATION_SITE_RELATIONSHIPS]: {
        disabled: true,
        disabledReason: DisabledStepReason.PERMISSION,
      },
      [Steps.ASSETS]: { disabled: false },
      [Steps.BUILD_SITE_ASSET_RELATIONSHIPS]: { disabled: false },
      [Steps.BUILD_ACCOUNT_SITE_RELATIONSHIPS]: { disabled: false },
    };
  } else {
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
  }
}
