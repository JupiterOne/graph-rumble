import { buildStepTestConfigForAPIKey } from '../../../test/config';
import { createStepCollectionTest } from '../../../test/recording';
import { Steps } from '../constants';

describe('#fetchAccountDetails - API Key', () => {
  test(
    'should collect data and create account entity',
    createStepCollectionTest({
      directoryName: __dirname,
      recordingName: 'fetchAccountDetailsShouldCollectData',
      stepConfig: buildStepTestConfigForAPIKey(Steps.ACCOUNT),
    }),
  );
});
