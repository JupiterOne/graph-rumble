import {
  createIntegrationEntity,
  Entity,
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
        createdAt: site.created_at,
        updatedAt: site.updated_at,
        clientId: site.client_id,
        organizationId: site.organization_id,
        name: site.name,
        description: site.description,
        scope: site.scope,
        excludes: site.excludes,
        inactive: site.inactive,
        deactivatedAt: site.deactivated_at,
        serviceCount: site.service_count,
        serviceCountTCP: site.service_count_tcp,
        serviceCountUDP: site.service_count_udp,
        serviceCountARP: site.service_count_arp,
        serviceCountICMP: site.service_count_icmp,
        assetCount: site.asset_count,
        //subnets: site.subnets,
        assetAddressCount: site.asset_address_count,
        lastTaskId: site.last_task_id,
        lastTaskAt: site.last_task_at,
        lastTaskBy: site.last_task_by,
        lastTaskDuration: site.last_task_duration,
      },
    },
  });
}
