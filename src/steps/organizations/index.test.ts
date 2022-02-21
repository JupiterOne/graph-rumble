import {
  executeStepWithDependencies,
  Recording,
} from '@jupiterone/integration-sdk-testing';
import { buildStepTestConfigForStep } from '../../../test/config';
import { setupRumbleRecording } from '../../../test/recording';
import { Steps } from '../constants';

describe('#fetchOrganizationsDetails', () => {
  let recording: Recording;

  afterEach(async () => {
    await recording.stop();
  });

  test('should create organization entities and organization account relationships', async () => {
    recording = setupRumbleRecording({
      directory: __dirname,
      name: 'fetchOrganizationsDetailsShouldCollectData',
    });

    const stepConfig = buildStepTestConfigForStep(Steps.ORGANIZATION);
    const stepResult = await executeStepWithDependencies(stepConfig);
    expect(stepResult).toMatchStepMetadata(stepConfig);
  });
});
