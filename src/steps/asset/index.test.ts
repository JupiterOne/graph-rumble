import {
  executeStepWithDependencies,
  Recording,
} from '@jupiterone/integration-sdk-testing';
import { buildStepTestConfigForAPIKey } from '../../../test/config';
import { setupRumbleRecording } from '../../../test/recording';
import { Steps } from '../constants';

describe('assetSteps - API Key', () => {
  let recording: Recording;
  afterEach(async () => {
    await recording.stop();
  });
  describe('#fetchAssetDetails', () => {
    test.skip('creates asset entities', async () => {
      recording = setupRumbleRecording({
        directory: __dirname,
        name: 'fetchAssetDetailsShouldCollectData',
      });

      const stepConfig = buildStepTestConfigForAPIKey(Steps.ASSETS);
      const stepResult = await executeStepWithDependencies(stepConfig);

      expect(stepResult).toMatchStepMetadata(stepConfig);
    });
  });

  describe('#buildSiteAssetRelationships', () => {
    test.skip('creates site has asset relationships', async () => {
      recording = setupRumbleRecording({
        directory: __dirname,
        name: 'buildSiteAssetRelationshipsShouldBuildRelationship',
      });

      const stepConfig = buildStepTestConfigForAPIKey(
        Steps.BUILD_SITE_ASSET_RELATIONSHIPS,
      );
      const stepResult = await executeStepWithDependencies(stepConfig);

      expect(stepResult).toMatchStepMetadata(stepConfig);
    });
  });
});
