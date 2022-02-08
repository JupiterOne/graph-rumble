import { RelationshipClass } from '@jupiterone/integration-sdk-core';
import {
  createMockStepExecutionContext,
  Recording,
} from '@jupiterone/integration-sdk-testing';
import { fetchOrganizationDetails } from '.';
import { integrationConfig } from '../../../test/config';
import { setupRumbleRecording } from '../../../test/recording';
import { fetchAccountDetails } from '../account';
import { Entities, Relationships } from '../constants';

describe('#fetchOrganizationsDetails', () => {
  let recording: Recording;

  afterEach(async () => {
    await recording.stop();
  });

  test('should collect data', async () => {
    recording = setupRumbleRecording({
      directory: __dirname,
      name: 'fetchOrganizationsDetailsShouldCollectData',
    });

    const context = createMockStepExecutionContext({
      instanceConfig: integrationConfig,
    });
    await fetchAccountDetails(context);
    await fetchOrganizationDetails(context);

    const filteredEntities = context.jobState.collectedEntities?.filter(
      (r) => r._type === Entities.ORGANIZATION._type,
    );

    expect(filteredEntities.length).toBe(3);
    expect(filteredEntities).toMatchGraphObjectSchema({
      _class: ['Organization'],
      schema: {
        additionalProperties: true,
        properties: {
          _type: { const: 'rumble_organization' },
          _key: { type: 'string' },
          name: { type: 'string' },
          displayName: { type: 'string' },
          createdOn: { type: 'number' },
          createdBy: { type: 'string' },
          updatedOn: { type: 'number' },
          updatedBy: { type: 'string' },
          _rawData: {
            type: 'array',
            items: { type: 'object' },
          },
        },
        required: [],
      },
    });
  });

  test('will establish relationship with account entity', async () => {
    recording = setupRumbleRecording({
      directory: __dirname,
      name: 'fetchOrganizationsDetailsShouldBuildAccountRelationship',
    });

    const context = createMockStepExecutionContext({
      instanceConfig: integrationConfig,
    });
    await fetchAccountDetails(context);
    await fetchOrganizationDetails(context);

    expect(context.jobState.collectedRelationships?.length).toBe(3);
    expect(
      context.jobState.collectedRelationships,
    ).toMatchDirectRelationshipSchema({
      schema: {
        properties: {
          _class: { const: RelationshipClass.HAS },
          _type: { const: Relationships.ACCOUNT_HAS_ORGANIZATION._type },
        },
      },
    });
  });
});
