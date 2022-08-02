import {
  createDirectRelationship,
  Entity,
  getRawData,
  IntegrationMissingKeyError,
  IntegrationStep,
  IntegrationStepExecutionContext,
  RelationshipClass,
} from '@jupiterone/integration-sdk-core';
import { createAPIClient } from '../../client';
import { IntegrationConfig } from '../../config';
import { RumbleSite } from '../../types';
import { ACCOUNT_ENTITY_KEY } from '../account';
import { Entities, Relationships, Steps } from '../constants';
import { createSiteEntity } from './converter';

async function fetchSitesDetails({
  instance,
  jobState,
  logger,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient({
    instance,
    logger: logger,
    name: instance.name,
  });

  await apiClient.iterateSites(async (site: RumbleSite) => {
    await jobState.addEntity(createSiteEntity(site));
  });
}

async function buildOrganizationSiteRelationships({
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  await jobState.iterateEntities(
    { _type: Entities.SITE._type },
    async (siteEntity) => {
      const site = getRawData<RumbleSite>(siteEntity);
      const orgId = site?.organization_id;

      const orgEntity = await jobState.findEntity(orgId);
      if (!orgEntity) {
        throw new IntegrationMissingKeyError(
          `Site is missing matching organization with key ${siteEntity.organizationId}`,
        );
      }
      await jobState.addRelationship(
        createDirectRelationship({
          from: orgEntity,
          to: siteEntity,
          _class: RelationshipClass.HAS,
        }),
      );
    },
  );
}

async function buildAccountSiteRelationships({
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const accountEntity = await jobState.getData<Entity>(ACCOUNT_ENTITY_KEY);
  if (!accountEntity) {
    throw new IntegrationMissingKeyError('Could not find account entity.');
  }

  await jobState.iterateEntities(
    { _type: Entities.SITE._type },
    async (siteEntity) => {
      await jobState.addRelationship(
        createDirectRelationship({
          from: accountEntity,
          to: siteEntity,
          _class: RelationshipClass.HAS,
        }),
      );
    },
  );
}

export const siteSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.SITES,
    name: 'Fetch Sites Details',
    entities: [Entities.SITE],
    relationships: [],
    dependsOn: [],
    executionHandler: fetchSitesDetails,
  },
  {
    id: Steps.BUILD_ORGANIZATION_SITE_RELATIONSHIPS,
    name: 'Build Organization Site Relationships',
    entities: [],
    relationships: [Relationships.ORGANIZATION_HAS_SITE],
    dependsOn: [Steps.SITES, Steps.ORGANIZATION],
    executionHandler: buildOrganizationSiteRelationships,
  },
  {
    id: Steps.BUILD_ACCOUNT_SITE_RELATIONSHIPS,
    name: 'Build Account Site Relationships',
    entities: [],
    relationships: [Relationships.ACCOUNT_HAS_SITE],
    mappedRelationships: [],
    dependsOn: [Steps.SITES, Steps.ACCOUNT],
    executionHandler: buildAccountSiteRelationships,
  },
];
