import {
  APIClientOptions,
  RunZeroAccount,
  RunZeroAsset,
  RunZeroOrganization,
  RunZeroSite,
  RunZeroUser,
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
  getAccount(): Promise<RunZeroAccount> | RunZeroAccount;
  iterateOrganizations(
    iteratee: ResourceIteratee<RunZeroOrganization>,
  ): Promise<void>;
  iterateUsers(iteratee: ResourceIteratee<RunZeroUser>): Promise<void>;
  iterateSites(iteratee: ResourceIteratee<RunZeroSite>): Promise<void>;
  iterateAssets(iteratee: ResourceIteratee<RunZeroAsset>): Promise<void>;
}
