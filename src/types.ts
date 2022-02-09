// Providers often supply types with their API libraries.

import { IntegrationLogger } from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from './config';

export interface RumbleAccount {
  id: string;
  name: string;
}

export interface RumbleOrganization {
  id: string;
  name: string;
  created_at: number;
  created_by: string;
  updated_at: number;
  client_id: string;
  download_token: string;
  download_token_created_at: number;
  demo: boolean;
  project: boolean;
  parent_id: string;
  description: string | null;
  inactive: boolean;
  deactivated_at: number;
  service_count: number;
  service_count_tcp: number;
  service_count_udp: number;
  service_count_arp: number;
  service_count_icmp: number;
  asset_count: number;
  export_token: string;
  export_token_created_at: number;
  export_token_last_used_at: number;
  export_token_last_used_by: string;
  export_token_counter: number;
  expiration_assets_stale: number;
  expiration_assets_offline: number;
  expiration_scans: number;
  expiration_warning_last_sent: number;
}

export type APIClientOptions = {
  config: IntegrationConfig;
  name: string;
  logger: IntegrationLogger;
};

// Those can be useful to a degree, but often they're just full of optional
// values. Understanding the response data may be more reliably accomplished by
// reviewing the API response recordings produced by testing the wrapper client
// (./client.ts). However, when there are no types provided, it is necessary to define
// opaque types for each resource, to communicate the records that are expected
// to come from an endpoint and are provided to iterating functions.

/*
import { Opaque } from 'type-fest';
export type AcmeUser = Opaque<any, 'AcmeUser'>;
export type AcmeGroup = Opaque<any, 'AcmeGroup'>;
*/
