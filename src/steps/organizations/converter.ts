import {
  createIntegrationEntity,
  Entity,
} from '@jupiterone/integration-sdk-core';
import { RumbleOrganization } from '../../types';
import { Entities } from '../constants';

export function createOrganizationEntity(org: RumbleOrganization): Entity {
  return createIntegrationEntity({
    entityData: {
      // for source we could pull in all the non-secret fields
      source: {
        ...org,
        download_token: undefined,
        export_token: undefined,
      },
      assign: {
        _key: org.id,
        _type: Entities.ORGANIZATION._type,
        _class: Entities.ORGANIZATION._class,
        name: org.name,
        displayName: org.name,
        // RumbleOrganization specific properties
        clientId: org.client_id,
        createdAt: org.created_at,
        createdBy: org.created_by,
        updatedAt: org.updated_at,
        downloadTokenCreatedAt: org.download_token_created_at,
        demo: org.demo,
        project: org.project,
        parentId: org.parent_id,
        // description can be a null field, if it is coerce to empty string
        description: org.description,
        inactive: org.inactive,
        deactivatedAt: org.deactivated_at,
        serviceCount: org.service_count,
        serviceCountTCP: org.service_count_tcp,
        serviceCountUDP: org.service_count_udp,
        serviceCountARP: org.service_count_arp,
        serviceCountICMP: org.service_count_icmp,
        assetCount: org.asset_count,
        exportTokenCreatedAt: org.export_token_created_at,
        exportTokenLastUsedAt: org.export_token_last_used_at,
        exportTokenLastUsedBy: org.export_token_last_used_by,
        exportTokenCounter: org.export_token_counter,
        expirationAssetsStale: org.expiration_assets_stale,
        expirationAssetsOffline: org.expiration_assets_offline,
        expirationScans: org.expiration_scans,
        expirationWarningLastSent: org.expiration_warning_last_sent,
        // Fields that are on RumbleOrganization but excluded from assign:
        // download_token
        // export_token
      },
    },
  });
}
