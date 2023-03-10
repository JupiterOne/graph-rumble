import { IntegrationProviderAuthenticationError } from '@jupiterone/integration-sdk-core';
import {
  createMockExecutionContext,
  Recording,
} from '@jupiterone/integration-sdk-testing';
import {
  apiKeyIntegrationConfig,
  exportTokenIntegrationConfig,
} from '../test/config';
import { setupRunZeroRecording } from '../test/recording';
import { IntegrationConfig, validateInvocation } from './config';

let recording: Recording;

afterEach(async () => {
  if (recording) {
    await recording.stop();
  }
});

describe('validateInvocation - common', () => {
  it('requires at least one of account api key or export token', async () => {
    const executionContext = createMockExecutionContext<IntegrationConfig>({
      instanceConfig: {} as IntegrationConfig,
    });

    await expect(validateInvocation(executionContext)).rejects.toThrow(
      'Config requires either Account API Key or Export Token',
    );
  });

  it('requires exactly one of account api key or export token', async () => {
    const executionContext = createMockExecutionContext<IntegrationConfig>({
      instanceConfig: {
        accountAPIKey: 'test',
        exportToken: 'test',
      } as IntegrationConfig,
    });

    await expect(validateInvocation(executionContext)).rejects.toThrow(
      'Config requires either an Account API Key or an Export Token, but not both',
    );
  });
});

describe('configTest - API Key', () => {
  it('validates invocation', async () => {
    recording = setupRunZeroRecording({
      directory: __dirname,
      name: 'client-validates-invocation',
    });

    const executionContext = createMockExecutionContext({
      instanceConfig: apiKeyIntegrationConfig,
    });

    await expect(validateInvocation(executionContext)).resolves.toBe(undefined);
  });

  it('auth error', async () => {
    recording = setupRunZeroRecording({
      directory: __dirname,
      name: 'client-auth-error',
      options: {
        recordFailedRequests: true,
      },
    });

    const executionContext = createMockExecutionContext({
      instanceConfig: {
        accountAPIKey: 'INVALID',
        exportToken: '',
      },
    });

    await expect(validateInvocation(executionContext)).rejects.toThrow(
      IntegrationProviderAuthenticationError,
    );
  });
});

describe('validateInvocation - Export Token', () => {
  it('auth error', async () => {
    recording = setupRunZeroRecording({
      directory: __dirname,
      name: 'validateInvocationAuthFailureExportToken',
      options: {
        recordFailedRequests: true,
      },
    });

    const executionContext = createMockExecutionContext({
      instanceConfig: {
        accountAPIKey: '',
        exportToken: 'Invalid',
      },
    });

    await expect(validateInvocation(executionContext)).rejects.toThrow(
      IntegrationProviderAuthenticationError,
    );
  });

  it('validates invocation', async () => {
    recording = setupRunZeroRecording({
      directory: __dirname,
      name: 'validatesInvocationSuccessExportToken',
    });

    const executionContext = createMockExecutionContext({
      instanceConfig: exportTokenIntegrationConfig,
    });

    await expect(validateInvocation(executionContext)).resolves.toBe(undefined);
  });
});
