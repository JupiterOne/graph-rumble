import { buildStepTestConfigForStep } from '../../../test/config';
import { createStepCollectionTest } from '../../../test/recording';
import { Steps } from '../constants';

describe('#fetchAccountDetails', () => {
  test(
    'should collect data and create account entity',
    createStepCollectionTest({
      directoryName: __dirname,
      recordingName: 'fetchAccountDetailsShouldCollectData',
      stepConfig: buildStepTestConfigForStep(Steps.ACCOUNT),
    }),
  );
});
