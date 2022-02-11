import {
  createMockStepExecutionContext,
  Recording,
} from '@jupiterone/integration-sdk-testing';
import { fetchSitesDetails } from '.';
import { integrationConfig } from '../../../test/config';
import { setupRumbleRecording } from '../../../test/recording';
import { fetchAccountDetails } from '../account';
import { Entities, Relationships } from '../constants';
import { fetchOrganizationDetails } from '../organizations';
import { fetchUserDetails } from '../users';

describe('#fetchSiteDetails', () => {
  let recording: Recording;

  afterEach(async () => {
    await recording.stop();
  });

  test('collects site entities', async () => {
    recording = setupRumbleRecording({
      directory: __dirname,
      name: 'fetchOrganizationsDetailsShouldCollectData',
    });

    const context = createMockStepExecutionContext({
      instanceConfig: integrationConfig,
    });

    await fetchAccountDetails(context);
    await fetchOrganizationDetails(context);
    await fetchUserDetails(context);
    await fetchSitesDetails(context);

    const siteEntities = context.jobState.collectedEntities.filter(
      (e) => e._type == Entities.SITE._type,
    );

    expect(siteEntities.length).toBeGreaterThan(0);
  });

  test('creates organization has site relationships', async () => {
    recording = setupRumbleRecording({
      directory: __dirname,
      name: 'fetchOrganizationsDetailsShouldCollectData',
    });

    const context = createMockStepExecutionContext({
      instanceConfig: integrationConfig,
    });

    await fetchAccountDetails(context);
    await fetchOrganizationDetails(context);
    await fetchUserDetails(context);
    await fetchSitesDetails(context);

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
