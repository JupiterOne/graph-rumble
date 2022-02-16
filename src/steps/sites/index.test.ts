import {
  createMockStepExecutionContext,
  Recording,
} from '@jupiterone/integration-sdk-testing';
import { buildOrganizationSiteRelationships, fetchSitesDetails } from '.';
import { integrationConfig } from '../../../test/config';
import { setupRumbleRecording } from '../../../test/recording';
import { fetchAccountDetails } from '../account';
import { Entities, Relationships } from '../constants';
import { fetchOrganizationDetails } from '../organizations';

describe('siteSteps', () => {
  let recording: Recording;

  afterEach(async () => {
    await recording.stop();
  });

  describe('#fetchSiteDetails', () => {
    test('creates site entities', async () => {
      recording = setupRumbleRecording({
        directory: __dirname,
        name: 'fetchSiteDetailsShouldCollectData',
      });

      const context = createMockStepExecutionContext({
        instanceConfig: integrationConfig,
      });

      const stepsHandlers = [fetchSitesDetails];

      for (const handler of stepsHandlers) {
        await handler(context);
      }

      const siteEntities = context.jobState.collectedEntities.filter(
        (e) => e._type == Entities.SITE._type,
      );

      expect(siteEntities.length).toBeGreaterThan(0);
    });
  });

  describe('#buildOrganizationSiteRelationship', () => {
    test('creates organization has site relationships', async () => {
      recording = setupRumbleRecording({
        directory: __dirname,
        name: 'buildOrganizationSiteRelationshipsShouldBuildRelationship',
      });

      const context = createMockStepExecutionContext({
        instanceConfig: integrationConfig,
      });

      const stepsHandlers = [
        fetchAccountDetails,
        fetchOrganizationDetails,
        fetchSitesDetails,
        buildOrganizationSiteRelationships,
      ];

      for (const handler of stepsHandlers) {
        await handler(context);
      }

      const siteRelationships = context.jobState.collectedRelationships.filter(
        (r) => r._type === Relationships.ORGANIZATION_HAS_SITE._type,
      );

      const siteEntities = context.jobState.collectedEntities.filter(
        (e) => e._type === Entities.SITE._type,
      );

      // don't want to have a result of length zero
      expect(siteRelationships.length).toBeGreaterThan(0);
      // sites relationships should be exactly equal to one per site entities
      expect(siteRelationships.length).toBe(siteEntities.length);
    });
  });
});
