import { buildStepTestConfigForStep } from '../../../test/config';
import { createStepCollectionTest } from '../../../test/recording';
import { Steps } from '../constants';

describe('#fetchOrganizationsDetails', () => {
  test(
    'should create organization entities and organization account relationships',
    createStepCollectionTest({
      directoryName: __dirname,
      recordingName: 'fetchOrganizationsDetailsShouldCollectData',
      stepConfig: buildStepTestConfigForStep(Steps.ORGANIZATION),
    }),
  );
});
