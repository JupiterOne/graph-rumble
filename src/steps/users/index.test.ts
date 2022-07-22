import { buildStepTestConfigForAPIKey } from '../../../test/config';
import { createStepCollectionTest } from '../../../test/recording';
import { Steps } from '../constants';

describe('userSteps - API Key', () => {
  describe('#fetchUserDetails', () => {
    test(
      'should create user entities and account user relationships',
      createStepCollectionTest({
        directoryName: __dirname,
        recordingName: 'fetchUserDetailsShouldCollectData',
        stepConfig: buildStepTestConfigForAPIKey(Steps.USERS),
      }),
    );
  });

  describe('#buildUserOrganizationRelationships', () => {
    test(
      'should establish relationship with organization entities',
      createStepCollectionTest({
        directoryName: __dirname,
        recordingName: 'buildUserOrganizationRelationshipsShouldCollectData',
        stepConfig: buildStepTestConfigForAPIKey(Steps.USERS),
      }),
    );
  });
});
