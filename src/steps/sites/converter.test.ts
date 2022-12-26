import { RumbleSite } from '../../types';
import { createSiteEntity } from './converter';

describe('#createSiteEntity', () => {
  test('should convert to entity', () => {
    const site: RumbleSite = {
      id: 'site_id',
      created_at: 1644331146,
      updated_at: 1645561808,
      client_id: 'client_id',
      organization_id: 'organization_id',
      name: 'test_site',
      description: '',
      scope: '',
      excludes: '',
      inactive: false,
      deactivated_at: 0,
      service_count: 0,
      service_count_tcp: 0,
      service_count_udp: 0,
      service_count_arp: 0,
      service_count_icmp: 0,
      asset_count: 0,
      live_asset_count: 0,
      recent_asset_count: 0,
      software_count: 0,
      vulnerability_count: 0,
      subnets: {},
      asset_address_count: 0,
      asset_address_extra_count: 0,
      last_task_id: 'task_id',
      last_task_at: 0,
      last_task_by: '',
      last_task_duration: 0,
    };

    const siteEntity = createSiteEntity(site);
    expect(siteEntity).toEqual({
      _class: ['Site'],
      _key: 'site_id',
      _type: 'rumble_site',
      name: 'test_site',
      description: '',
      displayName: 'test_site',
      id: 'site_id',
      createdAt: 1644331146,
      updatedAt: 1645561808,
      clientId: 'client_id',
      organizationId: 'organization_id',
      scope: '',
      excludes: '',
      inactive: false,
      serviceCount: 0,
      serviceCountTCP: 0,
      serviceCountUDP: 0,
      serviceCountARP: 0,
      serviceCountICMP: 0,
      assetCount: 0,
      liveAssetCount: 0,
      recentAssetCount: 0,
      softwareCount: 0,
      vulnerabilityCount: 0,
      assetAddressCount: 0,
      assetAddressExtraCount: 0,
      lastTaskId: 'task_id',
      lastTaskBy: '',
      lastTaskDuration: 0,
      _rawData: [
        {
          name: 'default',
          rawData: {
            ...site,
          },
        },
      ],
    });
  });
});
