import {
  IntegrationProviderAuthenticationError,
  IntegrationValidationError,
} from '@jupiterone/integration-sdk-core';
import {
  createMockExecutionContext,
  Recording,
} from '@jupiterone/integration-sdk-testing';
import { apiKeyIntegrationConfig } from '../test/config';
import { setupRumbleRecording } from '../test/recording';
import { IntegrationConfig, validateInvocation } from './config';

describe('configTest - API Key', () => {
  let recording: Recording;

  afterEach(async () => {
    if (recording) {
      await recording.stop();
    }
  });

  it('requires valid config', async () => {
    const executionContext = createMockExecutionContext<IntegrationConfig>({
      instanceConfig: {} as IntegrationConfig,
    });

    await expect(validateInvocation(executionContext)).rejects.toThrow(
      IntegrationValidationError,
    );
  });

  it('validates invocation', async () => {
    recording = setupRumbleRecording({
      directory: __dirname,
      name: 'client-validates-invocation',
    });

    const executionContext = createMockExecutionContext({
      instanceConfig: apiKeyIntegrationConfig,
    });

    await expect(validateInvocation(executionContext)).resolves.toBe(undefined);
  });

  it('auth error', async () => {
    recording = setupRumbleRecording({
      directory: __dirname,
      name: 'client-auth-error',
      options: {
        recordFailedRequests: true,
      },
    });

    const executionContext = createMockExecutionContext({
      instanceConfig: {
        accountAPIKey: 'INVALID',
        exportTokens: '',
      },
    });

    await expect(validateInvocation(executionContext)).rejects.toThrow(
      IntegrationProviderAuthenticationError,
    );
  });
});
