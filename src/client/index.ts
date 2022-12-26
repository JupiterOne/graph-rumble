import {
  APIClientOptions,
  RumbleAccount,
  RumbleAsset,
  RumbleOrganization,
  RumbleSite,
  RumbleUser,
} from '../types';
import { AccountAPIKeyClient } from './APIKeyClient';
import { ExportTokenApiClient } from './ExportTokenClient';

export const BASE_URI = 'https://console.runzero.com/api/v1.0';
export type ResourceIteratee<T> = (each: T) => Promise<void> | void;

export function createAPIClient(options: APIClientOptions): APIClient {
  if (options.instance.config.exportToken) {
    return new ExportTokenApiClient(options);
  } else {
    return new AccountAPIKeyClient(options);
  }
}

export interface APIClient {
  verifyAuthentication(): Promise<void>;
  getAccount(): Promise<RumbleAccount> | RumbleAccount;
  iterateOrganizations(
    iteratee: ResourceIteratee<RumbleOrganization>,
  ): Promise<void>;
  iterateUsers(iteratee: ResourceIteratee<RumbleUser>): Promise<void>;
  iterateSites(iteratee: ResourceIteratee<RumbleSite>): Promise<void>;
  iterateAssets(iteratee: ResourceIteratee<RumbleAsset>): Promise<void>;
}
