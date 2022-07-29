import {
  IntegrationExecutionContext,
  IntegrationValidationError,
  IntegrationInstanceConfigFieldMap,
  IntegrationInstanceConfig,
} from '@jupiterone/integration-sdk-core';
import { createAPIClient } from './client';

/**
 * A type describing the configuration fields required to execute the
 * integration for a specific account in the data provider.
 *
 * When executing the integration in a development environment, these values may
 * be provided in a `.env` file with environment variables. For example:
 *
 * - `ACCOUNT_API_KEY=abc becomes `instance.config.accountAPIKey = 'abc'`
 *
 * Environment variables are NOT used when the integration is executing in a
 * managed environment. For example, in JupiterOne, users configure
 * `instance.config` in a UI.
 */
export const instanceConfigFields: IntegrationInstanceConfigFieldMap = {
  accountAPIKey: {
    type: 'string',
    mask: true,
  },
  exportToken: {
    type: 'string',
    mask: true,
  },
};

/**
 * Properties provided by the `IntegrationInstance.config`. This reflects the
 * same properties defined by `instanceConfigFields`.
 */
export interface IntegrationConfig extends IntegrationInstanceConfig {
  /**
   * The Rumble Account API Key used to authenticate requests.
   */
  accountAPIKey: string;

  /**
   * Export token used to authenticate requests to export API endpoints.
   */
  exportToken: string;
}

export async function validateInvocation(
  context: IntegrationExecutionContext<IntegrationConfig>,
) {
  const { config, name } = context.instance;
  const logger = context.logger;

  if (!config.accountAPIKey && !config.exportToken) {
    throw new IntegrationValidationError(
      'Config requires either Account API Key or Export Token',
    );
  } else if (config.accountAPIKey && config.exportToken) {
    throw new IntegrationValidationError(
      'Config requires only one of an Account API Key or an Export Token',
    );
  }

  const apiClient = createAPIClient({
    instance: context.instance,
    name: name,
    logger: logger,
  });

  await apiClient.verifyAuthentication();
}
