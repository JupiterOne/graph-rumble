import {
  buildStepTestConfigForAPIKey,
  buildStepTestConfigForExportToken,
} from '../../../test/config';
import {
  createStepCollectionTest,
  runZeroRecordingOptions,
} from '../../../test/recording';
import { Steps } from '../constants';

describe('siteSteps - API Key', () => {
  describe('#fetchSiteDetails', () => {
    test(
      'creates site entities',
      createStepCollectionTest({
        recordingSetup: {
          directory: __dirname,
          name: 'fetchSiteDetailsShouldCollectData',
          ...runZeroRecordingOptions,
        },
        stepConfig: buildStepTestConfigForAPIKey(Steps.SITES),
      }),
    );

    describe('#buildOrganizationSiteRelationship', () => {
      test(
        'creates organization has site relationships',
        createStepCollectionTest({
          recordingSetup: {
            directory: __dirname,
            name: 'buildOrganizationSiteRelationshipsShouldBuildRelationship',
            ...runZeroRecordingOptions,
          },
          stepConfig: buildStepTestConfigForAPIKey(
            Steps.BUILD_ORGANIZATION_SITE_RELATIONSHIPS,
          ),
        }),
      );
    });
  });

  describe('#buildAccountSiteRelationships', () => {
    test(
      'creates account has site relationships',
      createStepCollectionTest({
        recordingSetup: {
          directory: __dirname,
          name: 'buildAccountSiteRelationships',
          ...runZeroRecordingOptions,
        },
        stepConfig: buildStepTestConfigForAPIKey(
          Steps.BUILD_ACCOUNT_SITE_RELATIONSHIPS,
        ),
      }),
    );
  });
});

describe('siteSteps - Export Tokens', () => {
  test(
    'creates site entities',
    createStepCollectionTest({
      recordingSetup: {
        directory: __dirname,
        name: 'fetchSiteDetailsExportTokens',
        ...runZeroRecordingOptions,
      },
      stepConfig: buildStepTestConfigForExportToken(Steps.SITES),
    }),
  );

  test(
    'creates account has site relationships',
    createStepCollectionTest({
      recordingSetup: {
        directory: __dirname,
        name: 'buildAccountHasSiteRelationshipsExportToken',
        ...runZeroRecordingOptions,
      },
      stepConfig: buildStepTestConfigForExportToken(
        Steps.BUILD_ACCOUNT_SITE_RELATIONSHIPS,
      ),
    }),
  );
});
