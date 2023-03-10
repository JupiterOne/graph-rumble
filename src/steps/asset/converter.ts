import {
  createIntegrationEntity,
  Entity,
  parseTimePropertyValue,
} from '@jupiterone/integration-sdk-core';
import { RunZeroAsset } from '../../types';
import { Entities } from '../constants';

export function createAssetEntity(asset: RunZeroAsset): Entity {
  const name = selectNameForAsset(asset);

  return createIntegrationEntity({
    entityData: {
      source: asset,
      assign: {
        _key: asset.id,
        _type: Entities.ASSET._type,
        _class: Entities.ASSET._class,
        name: name,
        createdAt: parseTimePropertyValue(asset.created_at, 'ms'),
        updatedAt: parseTimePropertyValue(asset.updated_at, 'ms'),
        alive: asset.alive,
        lastSeen: parseTimePropertyValue(asset.last_seen, 'ms'),
        firstSeen: parseTimePropertyValue(asset.first_seen, 'ms'),
        detectedBy: asset.detected_by,
        type: asset.type,
        osVendor: asset.os_vendor,
        hardware: asset.hw,
        category: asset.type,
        make: asset.hw_vendor,
        model: asset.hw_product,
        version: asset.hw_version,
        serial: null,
        hardwareVendor: asset.hw_vendor,
        hardwareModel: asset.hw_product,
        hardwareVersion: asset.hw_version,
        osDetails: asset.os + (asset.os_version ? ' ' + asset.os_version : ''),
        osName: asset.os_product,
        osVersion: asset.os_version,
        macAddresses: asset.macs,
        deviceId: null,
        serviceCount: asset.service_count,
        softwareCount: asset.software_count,
        vulnerabilityCount: asset.vulnerability_count,
        lastAgentId: asset.last_agent_id,
        lastTaskId: asset.last_task_id,
        newestMacAddress: asset.newest_mac,
        newestMacVendor: asset.newest_mac_vendor,
        orgName: asset.org_name,
        siteName: asset.site_name,
      },
    },
  });
}

function selectNameForAsset(asset: RunZeroAsset) {
  if (asset.names && asset.names.length > 0) {
    return asset.names[0];
  } else if (asset.hw) {
    return asset.hw;
  } else {
    return asset.id;
  }
}
