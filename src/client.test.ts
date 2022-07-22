import {
  createMockExecutionContext,
  createMockIntegrationLogger,
  Recording,
} from '@jupiterone/integration-sdk-testing';
import { apiKeyIntegrationConfig } from '../test/config';
import { setupRumbleRecording } from '../test/recording';
import { createAPIClient } from './client';
import { IntegrationConfig } from './config';

describe('apiClient - API Key', () => {
  let recording: Recording;
  afterEach(async () => {
    await recording.stop();
  });

  describe('#getExportTokens', () => {
    test('successfully gets export tokens', async () => {
      recording = setupRumbleRecording({
        directory: __dirname,
        name: 'get-keys-collects-data',
      });

      const executionContext = createMockExecutionContext<IntegrationConfig>({
        instanceConfig: apiKeyIntegrationConfig,
      });

      const apiClient = createAPIClient({
        instance: executionContext.instance,
        logger: executionContext.logger,
        name: executionContext.instance.name,
      });
      const keys = await apiClient.getExportTokens();
      expect(keys.length).toBeGreaterThan(0);
    });

    test('logs warning for missing keys', async () => {
      recording = setupRumbleRecording({
        directory: __dirname,
        name: 'logger-warns-missing-keys',
      });

      const executionContext = createMockExecutionContext<IntegrationConfig>({
        instanceConfig: apiKeyIntegrationConfig,
      });

      const mockLogger = createMockIntegrationLogger();
      mockLogger.warn = jest.fn();

      const apiClient = createAPIClient({
        instance: executionContext.instance,
        logger: mockLogger,
        name: executionContext.instance.name,
      });
      await apiClient.getExportTokens();
      expect(mockLogger.warn).toBeCalled();
    });
  });
});
