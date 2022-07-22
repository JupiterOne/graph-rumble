import { buildStepTestConfigForStep } from '../../../test/config';
import { createStepCollectionTest } from '../../../test/recording';
import { Steps } from '../constants';

describe('siteSteps', () => {
  describe('#fetchSiteDetails', () => {
    test(
      'creates site entities',
      createStepCollectionTest({
        directoryName: __dirname,
        recordingName: 'fetchSiteDetailsShouldCollectData',
        stepConfig: buildStepTestConfigForStep(Steps.SITES),
      }),
    );

    describe('#buildOrganizationSiteRelationship', () => {
      test(
        'creates organization has site relationships',
        createStepCollectionTest({
          directoryName: __dirname,
          recordingName:
            'buildOrganizationSiteRelationshipsShouldBuildRelationship',
          stepConfig: buildStepTestConfigForStep(Steps.SITES),
        }),
      );
    });
  });
});
