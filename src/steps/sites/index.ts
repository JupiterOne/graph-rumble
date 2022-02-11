import {
  createDirectRelationship,
  IntegrationMissingKeyError,
  IntegrationStepExecutionContext,
  RelationshipClass,
} from '@jupiterone/integration-sdk-core';
import { createAPIClient } from '../../client';
import { IntegrationConfig } from '../../config';
import { RumbleSite } from '../../types';
import { createSiteEntity } from './converter';

export async function fetchSitesDetails({
  instance,
  jobState,
  logger,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient({
    logger: logger,
    config: instance.config,
    name: instance.name,
  });

  await apiClient.iterateSites(async (site: RumbleSite) => {
    const siteEntity = await jobState.addEntity(createSiteEntity(site));
    const orgEntity = await jobState.findEntity(site.organization_id);
    if (!orgEntity) {
      throw new IntegrationMissingKeyError(
        `Site is missing matching organization with key ${site.organization_id}`,
      );
    }
    await jobState.addRelationship(
      createDirectRelationship({
        from: orgEntity,
        to: siteEntity,
        _class: RelationshipClass.HAS,
      }),
    );
  });
}
