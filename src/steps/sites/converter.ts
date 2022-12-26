import {
  createIntegrationEntity,
  Entity,
  parseTimePropertyValue,
} from '@jupiterone/integration-sdk-core';
import { RumbleSite } from '../../types';
import { Entities } from '../constants';

export function createSiteEntity(site: RumbleSite): Entity {
  return createIntegrationEntity({
    entityData: {
      source: site,
      assign: {
        _class: Entities.SITE._class,
        _key: site.id,
        _type: Entities.SITE._type,
        createdAt: parseTimePropertyValue(site.created_at, 'ms'),
        updatedAt: parseTimePropertyValue(site.updated_at, 'ms'),
        clientId: site.client_id,
        organizationId: site.organization_id,
        name: site.name ?? undefined,
        description: site.description ?? undefined,
        scope: site.scope ?? undefined,
        excludes: site.excludes ?? undefined,
        inactive: site.inactive,
        deactivatedAt: parseTimePropertyValue(site.deactivated_at, 'ms'),
        serviceCount: site.service_count,
        serviceCountTCP: site.service_count_tcp,
        serviceCountUDP: site.service_count_udp,
        serviceCountARP: site.service_count_arp,
        serviceCountICMP: site.service_count_icmp,
        assetCount: site.asset_count,
        liveAssetCount: site.live_asset_count,
        recentAssetCount: site.recent_asset_count,
        softwareCount: site.software_count,
        vulnerabilityCount: site.vulnerability_count,
        assetAddressCount: site.asset_address_count,
        assetAddressExtraCount: site.asset_address_extra_count,
        lastTaskId: site.last_task_id ?? undefined,
        lastTaskAt: parseTimePropertyValue(site.last_task_at, 'ms'),
        lastTaskBy: site.last_task_by ?? undefined,
        lastTaskDuration: site.last_task_duration,
      },
    },
  });
}
