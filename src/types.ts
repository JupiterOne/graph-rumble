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

export interface RumbleUser {
  id: string;
  client_id: string;
  created_at: number;
  updated_at: number;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  client_admin: boolean;
  // the first user can have a role of '' in this case that user will also be a client_admin
  // and will be assigned a role of 'admin' on their USER_ASSIGNED_ORGANIZATION
  org_default_role: Role | '' | null;
  org_roles: Record<string, Role>;
  reset_token_expiration: number;
  invite_token_expiration: number;
  last_login_ip: string | null;
  last_login_at: number;
  last_login_ua: string | null;
  last_activity_at: number;
  sso_only: boolean;
  login_failures: number;
  actions: number;
  last_action_at: number;
}

export interface RumbleSite {
  id: string;
  created_at: number;
  updated_at: number;
  client_id: string;
  organization_id: string;
  name: string;
  description: string | null;
  scope: string | null;
  excludes: string | null;
  inactive: boolean;
  deactivated_at: number;
  service_count: number;
  service_count_tcp: number;
  service_count_udp: number;
  service_count_arp: number;
  service_count_icmp: number;
  asset_count: number;
  subnets: Record<string, string>;
  asset_address_count: number;
  last_task_id: string;
  last_task_at: number;
  last_task_by: string;
  last_task_duration: number;
}

export type APIClientOptions = {
  config: IntegrationConfig;
  name: string;
  logger: IntegrationLogger;
};

export type Role = 'none' | 'viewer' | 'annotator' | 'user' | 'admin';
export const RoleLevel = {
  none: 0,
  viewer: 1,
  annotator: 2,
  user: 3,
  admin: 4,
};
