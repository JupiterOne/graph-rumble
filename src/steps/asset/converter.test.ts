import { RunZeroAsset } from '../../types';
import { createAssetEntity } from './converter';

describe('#createAssetEntity', () => {
  test('should convert to entity', () => {
    const asset: RunZeroAsset = {
      id: '40fa9e9a-e798-44e4-a521-d06a7782ed14',
      created_at: 1642795487,
      updated_at: 1642795487,
      organization_id: '463fed64-54bf-4369-b4b4-86a039773470',
      site_id: 'c9f0bc41-afdb-4053-945a-2a5333d1565a',
      alive: true,
      last_seen: 1583271232,
      first_seen: 1583271138,
      detected_by: 'arp',
      type: 'Server',
      os_vendor: 'Ubuntu',
      os_product: 'Linux',
      os_version: '',
      os: 'Ubuntu Linux',
      hw_vendor: '',
      hw_product: '',
      hw_version: '',
      hw: '',
      addresses: ['192.168.0.1'],
      addresses_extra: [],
      macs: ['a0:36:9f:50:77:d8'],
      mac_vendors: ['Intel Corporate'],
      names: ['ROUTER'],
      domains: [],
      services: {
        '192.168.0.1/0/arp/': {
          mac: 'a0:36:9f:50:77:d8',
          macDateAdded: '2011-04-29',
          macVendor: 'Intel Corporate',
          'service.address': '192.168.0.1',
          'service.id': '40fa9e9a-e798-44e4-a521-d06a7782ed14',
          'service.port': '0',
          'service.transport': 'arp',
          source:
            'arp\tsnmp.arpcache.192.168.0.19\tsnmp.arpcache.192.168.0.30\tsnmp.arpcache.192.168.0.31\tsnmp.arpcache.192.168.0.32',
          ts: '1583271232',
        },
        '192.168.0.1/0/icmp/': {
          addrs: '192.168.0.1',
          rtts: '104457\t78781',
          'service.address': '192.168.0.1',
          'service.id': '40fa9e9a-e798-44e4-a521-d06a7782ed14',
          'service.port': '0',
          'service.transport': 'icmp',
          ts: '1583271150',
        },
        '192.168.0.1/53/udp/': {
          addrs: '192.168.0.1',
          'fp.certainty': '0.85',
          'hostname.bind': 'router',
          'os.cpe23': 'cpe:/o:canonical:ubuntu_linux:-',
          'os.family': 'Linux',
          'os.product': 'Linux',
          'os.vendor': 'Ubuntu',
          product: 'ISC:BIND:9.11.3',
          protocol: 'dns',
          replies: 'www.google.com=A,172.217.1.132',
          resolvers: '172.253.212.13',
          rtts: '158454077\t93812355',
          'service.address': '192.168.0.1',
          'service.cpe23': 'cpe:/a:isc:bind:9.11.3',
          'service.family': 'BIND',
          'service.id': '40fa9e9a-e798-44e4-a521-d06a7782ed14',
          'service.port': '53',
          'service.transport': 'udp',
          subnets: '1.2.3.0/24-f=1-c=0-s=0',
          ts: '1583271194',
          'version.bind': '9.11.3-1ubuntu1.11-Ubuntu',
        },
        '192.168.0.1/5353/udp/': {
          protocol: 'mdns',
          replies: '1.0.168.192.in-addr.arpa.=PTR,router.local.',
          'service.address': '192.168.0.1',
          'service.id': '40fa9e9a-e798-44e4-a521-d06a7782ed14',
          'service.port': '5353',
          'service.transport': 'udp',
          ts: '1583271140',
        },
      },
      credentials: {},
      rtts: {
        'icmp/echo': ['78781', '104457'],
        'udp/dns': ['93812355', '158454077'],
      },
      attributes: {
        '@rumble.scan._links.ports.connected':
          '10:da:43:d7:59:14-192.168.0.31-1/0/12',
        '@rumble.scan._macs.ipmap': 'a0:36:9f:50:77:d8=192.168.0.1',
        '@rumble.scan.fp.certainty': '0.85',
        '@rumble.scan.match.db': 'dns-versionbind',
        '@rumble.scan.match.score': '00',
        '@rumble.scan.match.score.hw': '00',
        '@rumble.scan.match.score.os': '85',
        '@rumble.scan.os.cpe23': 'cpe:/o:canonical:ubuntu_linux:-',
        '@rumble.scan.os.family': 'Linux',
        '@rumble.scan.os.product': 'Linux',
        '@rumble.scan.os.vendor': 'Ubuntu',
        '@rumble.scan.service.cpe23': 'cpe:/a:isc:bind:9.11.3',
        '@rumble.scan.service.family': 'BIND',
        '@rumble.scan.service.product': 'BIND',
        '@rumble.scan.service.vendor': 'ISC',
        '@rumble.scan.service.version': '9.11.3',
        '@rumble.scan.switch.ip': '192.168.0.31',
        '@rumble.scan.switch.name': 'M4300-OFFICE',
        '@rumble.scan.switch.port': '192.168.0.31-1/0/12',
        '@rumble.scan.vlan': '1',
        '_links.ports.connected': '10:da:43:d7:59:14-192.168.0.31-1/0/12',
        '_macs.ipmap': 'a0:36:9f:50:77:d8=192.168.0.1',
        'fp.certainty': '0.85',
        'match.db': 'dns-versionbind',
        'match.score': '00',
        'match.score.hw': '00',
        'match.score.os': '85',
        'os.cpe23': 'cpe:/o:canonical:ubuntu_linux:-',
        'os.family': 'Linux',
        'os.product': 'Linux',
        'os.vendor': 'Ubuntu',
        'service.cpe23': 'cpe:/a:isc:bind:9.11.3',
        'service.family': 'BIND',
        'service.product': 'BIND',
        'service.vendor': 'ISC',
        'service.version': '9.11.3',
        'switch.ip': '192.168.0.31',
        'switch.name': 'M4300-OFFICE',
        'switch.port': '192.168.0.31-1/0/12',
        vlan: '1',
      },
      service_count: 4,
      service_count_tcp: 0,
      service_count_udp: 2,
      service_count_arp: 1,
      service_count_icmp: 1,
      lowest_ttl: 0,
      lowest_rtt: 78781,
      last_agent_id: '00000000-0000-0000-0000-000000000000',
      last_task_id: '374cc0f8-ca77-40d8-96c8-b53d563e7880',
      newest_mac: 'a0:36:9f:50:77:d8',
      newest_mac_vendor: 'Intel Corporate',
      newest_mac_age: 1304035200000000000,
      service_ports_tcp: [],
      service_ports_udp: ['53', '5353'],
      service_protocols: ['dns', 'mdns'],
      service_products: ['isc bind'],
      scanned: true,
      source_ids: [1],
      eol_os: 0,
      eol_os_ext: 0,
      sources: ['rumble'],
      org_name: 'Demo Organization',
      site_name: 'Corporate',
      agent_name: null,
      subnets: {},
      software_count: 0,
      vulnerability_count: 0,
      outlier_score: 0,
      outlier_raw: 0,
      agent_external_ip: null,
      hosted_zone_name: null,
      foreign_attributes: {},
    };
    expect(createAssetEntity(asset)).toMatchSnapshot();
  });
});
