import {
  createIntegrationEntity,
  Entity,
  parseTimePropertyValue,
} from '@jupiterone/integration-sdk-core';
import { RumbleAsset } from '../../types';
import { Entities } from '../constants';

export function createAssetEntity(asset: RumbleAsset): Entity {
  const name =
    asset.names && asset.names.length > 0 ? asset.names[0] : asset.id;

  return createIntegrationEntity({
    entityData: {
      source: asset,
      assign: {
        _key: asset.id,
        _type: Entities.ASSET._type,
        _class: Entities.ASSET._class,
        name: name,
        createdAt: parseTimePropertyValue(asset.created_at),
        updatedAt: parseTimePropertyValue(asset.updated_at),
        alive: asset.alive,
        lastSeen: parseTimePropertyValue(asset.last_seen),
        firstSeen: parseTimePropertyValue(asset.first_seen),
        detectedBy: asset.detected_by,
        type: asset.type,
        osVendor: asset.os_vendor,
        osProduct: asset.os_product,
        osVersion: asset.os_version,
        hwVendor: asset.hw_vendor,
        hwProduct: asset.hw_product,
        hw: asset.hw,
      },
    },
  });
}
