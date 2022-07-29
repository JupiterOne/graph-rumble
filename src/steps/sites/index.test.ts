import {
  buildStepTestConfigForAPIKey,
  buildStepTestConfigForExportToken,
} from '../../../test/config';
import {
  createStepCollectionTest,
  rumbleRecordingOptions,
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
          ...rumbleRecordingOptions,
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
            ...rumbleRecordingOptions,
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
          ...rumbleRecordingOptions,
        },
        stepConfig: buildStepTestConfigForAPIKey(
          Steps.BUILD_SITE_ACCOUNT_RELATIONSHIPS,
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
        ...rumbleRecordingOptions,
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
        ...rumbleRecordingOptions,
      },
      stepConfig: buildStepTestConfigForExportToken(
        Steps.BUILD_SITE_ACCOUNT_RELATIONSHIPS,
      ),
    }),
  );
});
