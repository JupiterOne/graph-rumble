import {
  buildStepTestConfigForAPIKey,
  buildStepTestConfigForExportTokens,
} from '../../../test/config';
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

describe('#fetchAccountDetails - Export Tokens', () => {
  // NOTE: This test won't produce a recording under current implementation
  // of client. Rumble account produced using static integration data.
  test(
    'should collect data and create account entity',
    createStepCollectionTest({
      recordingSetup: {
        directory: __dirname,
        name: 'fetchAccountDetailsExportTokens',
        ...rumbleRecordingOptions,
      },
      stepConfig: buildStepTestConfigForExportTokens(Steps.ACCOUNT),
    }),
  );
});
