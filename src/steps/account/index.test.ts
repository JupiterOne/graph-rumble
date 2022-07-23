import { buildStepTestConfigForAPIKey } from '../../../test/config';
import {
  createStepCollectionTest,
  rumbleRecordingOptions,
} from '../../../test/recording';
import { Steps } from '../constants';

describe('#fetchAccountDetails - API Key', () => {
  test(
    'should collect data and create account entity',
    createStepCollectionTest({
      recordingSetup: {
        directory: __dirname,
        name: 'fetchAccountDetailsShouldCollectData',
        ...rumbleRecordingOptions,
      },
      stepConfig: buildStepTestConfigForAPIKey(Steps.ACCOUNT),
    }),
  );
});
