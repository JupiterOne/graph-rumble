import { buildStepTestConfigForAPIKey } from '../../../test/config';
import {
  createStepCollectionTest,
  runZeroRecordingOptions,
} from '../../../test/recording';
import { Steps } from '../constants';

describe('userSteps - API Key', () => {
  describe('#fetchUserDetails', () => {
    test(
      'should create user entities and account user relationships',
      createStepCollectionTest({
        recordingSetup: {
          directory: __dirname,
          name: 'fetchUserDetailsShouldCollectData',
          ...runZeroRecordingOptions,
        },
        stepConfig: buildStepTestConfigForAPIKey(Steps.USERS),
      }),
    );
  });

  describe('#buildUserOrganizationRelationships', () => {
    test(
      'should establish relationship with organization entities',
      createStepCollectionTest({
        recordingSetup: {
          directory: __dirname,
          name: 'buildUserOrganizationRelationshipsShouldCollectData',
          ...runZeroRecordingOptions,
        },
        stepConfig: buildStepTestConfigForAPIKey(
          Steps.BUILD_USER_ORGANIZATION_RELATIONSHIPS,
        ),
      }),
    );
  });
});
