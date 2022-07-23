import {
  createDirectRelationship,
  getRawData,
  IntegrationMissingKeyError,
  IntegrationStep,
  IntegrationStepExecutionContext,
  RelationshipClass,
} from '@jupiterone/integration-sdk-core';
import { createAPIClient } from '../../client';
import { IntegrationConfig } from '../../config';
import { RumbleAsset } from '../../types';
import { Entities, Relationships, Steps } from '../constants';
import { createAssetEntity } from './converter';

async function fetchAssetDetails({
  instance,
  jobState,
  logger,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient({
    instance,
    name: instance.name,
    logger: logger,
  });

  await apiClient.iterateAssets(async (asset) => {
    await jobState.addEntity(createAssetEntity(asset));
  });
}

async function buildSiteAssetRelationships({
  jobState,
  logger,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  await jobState.iterateEntities(
    { _type: Entities.ASSET._type },
    async (assetEntity) => {
      const asset = getRawData<RumbleAsset>(assetEntity) as RumbleAsset;

      const siteEntity = await jobState.findEntity(asset.site_id);
      if (!siteEntity) {
        throw new IntegrationMissingKeyError(
          `Expected to find site with id: ${asset.site_id}, but found none.`,
        );
      }

      await jobState.addRelationship(
        createDirectRelationship({
          from: siteEntity,
          to: assetEntity,
          _class: RelationshipClass.HAS,
        }),
      );
    },
  );
}

export const assetSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.ASSETS,
    name: 'Fetch Asset Details',
    entities: [Entities.ASSET],
    relationships: [],
    dependsOn: [],
    executionHandler: fetchAssetDetails,
  },
  {
    id: Steps.BUILD_SITE_ASSET_RELATIONSHIPS,
    name: 'Build Site Asset Relationships',
    entities: [],
    relationships: [Relationships.SITE_HAS_ASSET],
    dependsOn: [Steps.SITES, Steps.ASSETS],
    executionHandler: buildSiteAssetRelationships,
  },
];
