import { RunZeroSite } from '../../types';
import { createSiteEntity } from './converter';

describe('#createSiteEntity', () => {
  test('should convert to entity', () => {
    const site: RunZeroSite = {
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

    expect(createSiteEntity(site)).toMatchSnapshot();
  });
});
