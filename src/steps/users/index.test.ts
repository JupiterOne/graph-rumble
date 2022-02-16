import { RelationshipClass } from '@jupiterone/integration-sdk-core';
import {
  createMockStepExecutionContext,
  Recording,
} from '@jupiterone/integration-sdk-testing';
import { buildUserOrganizationRelationships, fetchUserDetails } from '.';
import { integrationConfig } from '../../../test/config';
import { setupRumbleRecording } from '../../../test/recording';
import { fetchAccountDetails } from '../account';
import { Entities, Relationships } from '../constants';
import { fetchOrganizationDetails } from '../organizations';

async function executeSteps(context): Promise<void> {
  await fetchAccountDetails(context);
  await fetchOrganizationDetails(context);
  await fetchUserDetails(context);
  await buildUserOrganizationRelationships(context);
}

describe('#fetchUserDetails', () => {
  let recording: Recording;

  afterEach(async () => {
    await recording.stop();
  });

  test('should collect data', async () => {
    recording = setupRumbleRecording({
      directory: __dirname,
      name: 'userSteps',
    });

    const context = createMockStepExecutionContext({
      instanceConfig: integrationConfig,
    });

    await executeSteps(context);

    const filteredEntities = context.jobState.collectedEntities?.filter(
      (r) => r._type === Entities.USER._type,
    );

    expect(filteredEntities.length).toBe(6);
    expect(filteredEntities).toMatchGraphObjectSchema({
      _class: ['User'],
      schema: {
        additionalProperties: true,
        properties: {
          _type: { const: 'rumble_user' },
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
      name: 'userSteps',
    });

    const context = createMockStepExecutionContext({
      instanceConfig: integrationConfig,
    });

    await executeSteps(context);

    const userAccountRelationships =
      context.jobState.collectedRelationships?.filter(
        (r) => r._type === Relationships.ACCOUNT_HAS_USER._type,
      );

    expect(userAccountRelationships.length).toBeGreaterThan(0);
    expect(userAccountRelationships).toMatchDirectRelationshipSchema({
      schema: {
        properties: {
          _class: { const: RelationshipClass.HAS },
          _type: { const: Relationships.ACCOUNT_HAS_USER._type },
        },
      },
    });
  });

  test('will establish relationship with organization entities', async () => {
    recording = setupRumbleRecording({
      directory: __dirname,
      name: 'userSteps',
    });

    const context = createMockStepExecutionContext({
      instanceConfig: integrationConfig,
    });

    await executeSteps(context);

    const userOrganizationRelationships =
      context.jobState.collectedRelationships?.filter(
        (r) => r._type === Relationships.USER_ASSIGNED_ORGANIZATION._type,
      );

    expect(userOrganizationRelationships.length).toBeGreaterThan(0);
    expect(userOrganizationRelationships).toMatchDirectRelationshipSchema({
      schema: {
        properties: {
          _class: { const: RelationshipClass.ASSIGNED },
          _type: { const: Relationships.USER_ASSIGNED_ORGANIZATION._type },
          defaultRole: { type: 'string' },
          assignedRole: { type: 'string' },
        },
      },
    });
  });
});
