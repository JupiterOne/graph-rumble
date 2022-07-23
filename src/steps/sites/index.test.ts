import { buildStepTestConfigForAPIKey } from '../../../test/config';
import {
  createStepCollectionTest,
  rumbleRecordingOptions,
} from '../../../test/recording';
import { Steps } from '../constants';

describe('siteSteps - API Key', () => {
  describe('#fetchSiteDetails', () => {
    test(
      'creates site entities',
      createStepCollectionTest({
        recordingSetup: {
          directory: __dirname,
          name: 'fetchSiteDetailsShouldCollectData',
          ...rumbleRecordingOptions,
        },
        stepConfig: buildStepTestConfigForAPIKey(Steps.SITES),
      }),
    );

    describe('#buildOrganizationSiteRelationship', () => {
      test(
        'creates organization has site relationships',
        createStepCollectionTest({
          recordingSetup: {
            directory: __dirname,
            name: 'buildOrganizationSiteRelationshipsShouldBuildRelationship',
            ...rumbleRecordingOptions,
          },
          stepConfig: buildStepTestConfigForAPIKey(
            Steps.BUILD_ORGANIZATION_SITE_RELATIONSHIPS,
          ),
        }),
      );
    });
  });
});
