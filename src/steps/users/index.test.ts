import {
  executeStepWithDependencies,
  Recording,
} from '@jupiterone/integration-sdk-testing';
import { buildStepTestConfigForStep } from '../../../test/config';
import { setupRumbleRecording } from '../../../test/recording';
import { Steps } from '../constants';

describe('userSteps', () => {
  let recording: Recording;

  afterEach(async () => {
    await recording.stop();
  });

  test('should create user entities and account user relationships', async () => {
    recording = setupRumbleRecording({
      directory: __dirname,
      name: 'fetchUserDetailsShouldCollectData',
    });

    const stepConfig = buildStepTestConfigForStep(Steps.USERS);
    const stepResult = await executeStepWithDependencies(stepConfig);

    expect(stepResult).toMatchStepMetadata(stepConfig);
  });

  describe('#buildUserOrganizationRelationships', () => {
    test('should establish relationship with organization entities', async () => {
      recording = setupRumbleRecording({
        directory: __dirname,
        name: 'buildUserOrganizationRelationshipsShouldCollectData',
      });

      const stepConfig = buildStepTestConfigForStep(
        Steps.BUILD_USER_ORGANIZATION_RELATIONSHIPS,
      );
      const stepResult = await executeStepWithDependencies(stepConfig);
      expect(stepResult).toMatchStepMetadata(stepConfig);
    });
  });
});
