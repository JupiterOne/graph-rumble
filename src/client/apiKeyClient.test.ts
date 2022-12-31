import {
  createMockExecutionContext,
  createMockIntegrationLogger,
  Recording,
} from '@jupiterone/integration-sdk-testing';
import { apiKeyIntegrationConfig } from '../../test/config';
import { setupRunZeroRecording } from '../../test/recording';
import { IntegrationConfig } from '../config';
import { AccountAPIKeyClient } from './APIKeyClient';

describe('apiClient - API Key', () => {
  let recording: Recording;
  afterEach(async () => {
    await recording.stop();
  });

  describe('#getExportTokens', () => {
    test('successfully gets export tokens', async () => {
      recording = setupRunZeroRecording({
        directory: __dirname,
        name: 'get-keys-collects-data',
      });

      const executionContext = createMockExecutionContext<IntegrationConfig>({
        instanceConfig: apiKeyIntegrationConfig,
      });

      const apiClient = new AccountAPIKeyClient({
        instance: executionContext.instance,
        logger: executionContext.logger,
        name: executionContext.instance.name,
      });

      const keys = await apiClient.getExportTokens();
      expect(keys.length).toBeGreaterThan(0);
    });

    test('logs warning for missing keys', async () => {
      recording = setupRunZeroRecording({
        directory: __dirname,
        name: 'logger-warns-missing-keys',
      });

      const executionContext = createMockExecutionContext<IntegrationConfig>({
        instanceConfig: apiKeyIntegrationConfig,
      });

      const mockLogger = createMockIntegrationLogger();
      mockLogger.warn = jest.fn();

      const apiClient = new AccountAPIKeyClient({
        instance: executionContext.instance,
        logger: mockLogger,
        name: executionContext.instance.name,
      });
      await apiClient.getExportTokens();
      expect(mockLogger.warn).toBeCalled();
    });
  });
});
