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
  exportTokens: {
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
   * Comma-separated list of export tokens to use
   * the export API.
   */
  exportTokens: string;
}

export async function validateInvocation(
  context: IntegrationExecutionContext<IntegrationConfig>,
) {
  const { config, name } = context.instance;
  const logger = context.logger;

  if (!config.accountAPIKey && !config.exportTokens) {
    throw new IntegrationValidationError(
      'Config requires either Account API Key or Export Tokens',
    );
  } else if (config.accountAPIKey && config.exportTokens) {
    throw new IntegrationValidationError(
      'Config requires exactly one of Account API Key or Export Tokens',
    );
  }

  const apiClient = createAPIClient({
    instance: context.instance,
    name: name,
    logger: logger,
  });

  await apiClient.verifyAuthentication();
}
