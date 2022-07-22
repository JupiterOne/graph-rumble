import { buildStepTestConfigForAPIKey } from '../../../test/config';
import { createStepCollectionTest } from '../../../test/recording';
import { Steps } from '../constants';

describe('siteSteps - API Key', () => {
  describe('#fetchSiteDetails', () => {
    test(
      'creates site entities',
      createStepCollectionTest({
        directoryName: __dirname,
        recordingName: 'fetchSiteDetailsShouldCollectData',
        stepConfig: buildStepTestConfigForAPIKey(Steps.SITES),
      }),
    );

    describe('#buildOrganizationSiteRelationship', () => {
      test(
        'creates organization has site relationships',
        createStepCollectionTest({
          directoryName: __dirname,
          recordingName:
            'buildOrganizationSiteRelationshipsShouldBuildRelationship',
          stepConfig: buildStepTestConfigForAPIKey(Steps.SITES),
        }),
      );
    });
  });
});
