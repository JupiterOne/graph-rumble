import {
  executeStepWithDependencies,
  Recording,
} from '@jupiterone/integration-sdk-testing';
import { buildStepTestConfigForStep } from '../../../test/config';
import { setupRumbleRecording } from '../../../test/recording';
import { Steps } from '../constants';

describe('#fetchAccountDetails', () => {
  let recording: Recording;

  afterEach(async () => {
    await recording.stop();
  });

  test('should collect data and create account entity', async () => {
    recording = setupRumbleRecording({
      directory: __dirname,
      name: 'fetchAccountDetailsShouldCollectData',
    });

    const stepConfig = buildStepTestConfigForStep(Steps.ACCOUNT);
    const stepResult = await executeStepWithDependencies(stepConfig);
    expect(stepResult).toMatchStepMetadata(stepConfig);
  });
});
