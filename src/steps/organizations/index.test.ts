import { buildStepTestConfigForAPIKey } from '../../../test/config';
import { createStepCollectionTest } from '../../../test/recording';
import { Steps } from '../constants';

describe('#fetchOrganizationsDetails - API Key', () => {
  test(
    'should create organization entities and organization account relationships',
    createStepCollectionTest({
      directoryName: __dirname,
      recordingName: 'fetchOrganizationsDetailsShouldCollectData',
      stepConfig: buildStepTestConfigForAPIKey(Steps.ORGANIZATION),
    }),
  );
});
