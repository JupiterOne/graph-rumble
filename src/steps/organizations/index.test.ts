import { buildStepTestConfigForAPIKey } from '../../../test/config';
import {
  createStepCollectionTest,
  runZeroRecordingOptions,
} from '../../../test/recording';
import { Steps } from '../constants';

describe('#fetchOrganizationsDetails - API Key', () => {
  test(
    'should create organization entities and organization account relationships',
    createStepCollectionTest({
      recordingSetup: {
        directory: __dirname,
        name: 'fetchOrganizationsDetailsShouldCollectData',
        ...runZeroRecordingOptions,
      },
      stepConfig: buildStepTestConfigForAPIKey(Steps.ORGANIZATION),
    }),
  );
});
