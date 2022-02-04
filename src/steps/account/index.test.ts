import {
  createMockStepExecutionContext,
  Recording,
} from '@jupiterone/integration-sdk-testing';
import { fetchAccountDetails } from '.';
import { integrationConfig } from '../../../test/config';
import { setupRumbleRecording } from '../../../test/recording';

describe('#fetchAccountDetails', () => {
  let recording: Recording;

  afterEach(async () => {
    await recording.stop();
  });

  test('should collect data', async () => {
    recording = setupRumbleRecording({
      directory: __dirname,
      name: 'fetchAccountDetailsShouldCollectData',
    });

    const context = createMockStepExecutionContext({
      instanceConfig: integrationConfig,
    });
    await fetchAccountDetails(context);

    expect(context.jobState.collectedEntities?.length).toBe(1);
    expect(context.jobState.collectedEntities).toMatchGraphObjectSchema({
      _class: ['Account'],
      schema: {
        additionalProperties: true,
        properties: {
          _type: { const: 'rumble_account' },
          _key: { type: 'string' },
          name: { type: 'string' },
          displayName: { type: 'string' },
          createdOn: { type: 'number' },
          createdBy: { type: 'string' },
          updatedOn: { type: 'number' },
          updatedBy: { type: 'string' },
          _rawData: {
            type: 'array',
            items: { type: 'object' },
          },
        },
        required: [],
      },
    });
  });
});
