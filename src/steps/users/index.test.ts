import { buildStepTestConfigForAPIKey } from '../../../test/config';
import {
  createStepCollectionTest,
  rumbleRecordingOptions,
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
          ...rumbleRecordingOptions,
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
          ...rumbleRecordingOptions,
        },
        stepConfig: buildStepTestConfigForAPIKey(
          Steps.BUILD_USER_ORGANIZATION_RELATIONSHIPS,
        ),
      }),
    );
  });
});
