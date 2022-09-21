import {
  createIntegrationEntity,
  Entity,
  parseTimePropertyValue,
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
        displayName: org.name ?? undefined,
        // RumbleOrganization specific properties
        clientId: org.client_id,
        createdAt: parseTimePropertyValue(org.created_at, 'ms'),
        createdBy: org.created_by,
        updatedAt: parseTimePropertyValue(org.updated_at, 'ms'),
        downloadTokenCreatedAt: parseTimePropertyValue(
          org.download_token_created_at,
          'ms',
        ),
        demo: org.demo,
        project: org.project,
        parentId: org.parent_id,
        // description can be a null field, if it is coerce to empty string
        description: org.description ?? undefined,
        inactive: org.inactive,
        deactivatedAt: parseTimePropertyValue(org.deactivated_at, 'ms'),
        serviceCount: org.service_count,
        serviceCountTCP: org.service_count_tcp,
        serviceCountUDP: org.service_count_udp,
        serviceCountARP: org.service_count_arp,
        serviceCountICMP: org.service_count_icmp,
        assetCount: org.asset_count,
        exportTokenCreatedAt: parseTimePropertyValue(
          org.export_token_created_at,
          'ms',
        ),
        exportTokenLastUsedAt: parseTimePropertyValue(
          org.export_token_last_used_at,
          'ms',
        ),
        exportTokenLastUsedBy: org.export_token_last_used_by,
        exportTokenCounter: org.export_token_counter,
        expirationAssetsStale: org.expiration_assets_stale,
        expirationAssetsOffline: org.expiration_assets_offline,
        expirationScans: org.expiration_scans,
        expirationWarningLastSent: parseTimePropertyValue(
          org.expiration_warning_last_sent,
          'ms',
        ),
        // Fields that are on RumbleOrganization but excluded from assign:
        // download_token
        // export_token
      },
    },
  });
}
