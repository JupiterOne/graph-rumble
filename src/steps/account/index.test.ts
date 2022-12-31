import {
  buildStepTestConfigForAPIKey,
  buildStepTestConfigForExportToken,
} from '../../../test/config';
import {
  createStepCollectionTest,
  runZeroRecordingOptions,
} from '../../../test/recording';
import { Steps } from '../constants';

describe('#fetchAccountDetails - API Key', () => {
  test(
    'should collect data and create account entity',
    createStepCollectionTest({
      recordingSetup: {
        directory: __dirname,
        name: 'fetchAccountDetailsShouldCollectData',
        ...runZeroRecordingOptions,
      },
      stepConfig: buildStepTestConfigForAPIKey(Steps.ACCOUNT),
    }),
  );
});

describe('#fetchAccountDetails - Export Tokens', () => {
  // NOTE: This test won't produce a recording under current implementation
  // of client. RunZero account produced using static integration data.
  test(
    'should collect data and create account entity',
    createStepCollectionTest({
      recordingSetup: {
        directory: __dirname,
        name: 'fetchAccountDetailsExportTokens',
        ...runZeroRecordingOptions,
      },
      stepConfig: buildStepTestConfigForExportToken(Steps.ACCOUNT),
    }),
  );
});
