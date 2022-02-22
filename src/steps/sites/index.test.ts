import {
  executeStepWithDependencies,
  Recording,
} from '@jupiterone/integration-sdk-testing';
import { buildStepTestConfigForStep } from '../../../test/config';
import { setupRumbleRecording } from '../../../test/recording';
import { Steps } from '../constants';

describe('siteSteps', () => {
  let recording: Recording;

  afterEach(async () => {
    await recording.stop();
  });

  describe('#fetchSiteDetails', () => {
    test('creates site entities', async () => {
      recording = setupRumbleRecording({
        directory: __dirname,
        name: 'fetchSiteDetailsShouldCollectData',
      });

      const stepConfig = buildStepTestConfigForStep(Steps.SITES);
      const stepResult = await executeStepWithDependencies(stepConfig);

      expect(stepResult).toMatchStepMetadata(stepConfig);
    });
  });

  describe('#buildOrganizationSiteRelationship', () => {
    test('creates organization has site relationships', async () => {
      recording = setupRumbleRecording({
        directory: __dirname,
        name: 'buildOrganizationSiteRelationshipsShouldBuildRelationship',
      });

      const stepConfig = buildStepTestConfigForStep(
        Steps.BUILD_ORGANIZATION_SITE_RELATIONSHIPS,
      );
      const stepResult = await executeStepWithDependencies(stepConfig);

      expect(stepResult).toMatchStepMetadata(stepConfig);
    });
  });
});
