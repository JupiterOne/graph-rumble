import {
  IntegrationProviderAPIError,
  IntegrationProviderAuthenticationError,
} from '@jupiterone/integration-sdk-core';

import { APIClientOptions, RumbleAccount, RumbleOrganization } from './types';
import got, { CancelableRequest, Response } from 'got';

export type ResourceIteratee<T> = (each: T) => Promise<void> | void;

const BASE_URI = 'https://console.rumble.run';

/**
 * An APIClient maintains authentication state and provides an interface to
 * third party data APIs.
 *
 * It is recommended that integrations wrap provider data APIs to provide a
 * place to handle error responses and implement common patterns for iterating
 * resources.
 */
export class APIClient {
  constructor(readonly options: APIClientOptions) {}

  public async verifyAuthentication(): Promise<void> {
    const uri = '/api/v1.0/account/orgs';
    const endpoint = BASE_URI + uri;
    const request = this.createRequest(endpoint);

    try {
      await request;
    } catch (err) {
      throw new IntegrationProviderAuthenticationError({
        cause: err,
        endpoint: BASE_URI + uri,
        status: err.status,
        statusText: err.statusText,
      });
    }
  }

  /**
   * getAccount gets account info from the Rumble API by making a call to /account/orgs
   * @returns a Promise for a RumbleAccount
   */
  public async getAccount(): Promise<RumbleAccount> {
    const uri = '/api/v1.0/account/orgs';
    const endpoint = BASE_URI + uri;
    const request = this.createRequest(endpoint);

    let acc: RumbleAccount;
    try {
      const response = await request;
      const result = await JSON.parse(response.body);

      acc = {
        // Every account is guaranteed at least one Organization
        // so we can expect one organization to read the client_id from
        // See https://www.rumble.run/docs/organizations-and-sites/
        id: result[0].client_id,

        // we use integration name for the account name
        // since there is not an obvious name value from
        // the rumble api. accountId tag might work as well.
        name: this.options.name,
      };
    } catch (err) {
      throw new IntegrationProviderAPIError({
        cause: err,
        endpoint: endpoint,
        status: err.response.statusCode,
        statusText: err.response.statusMessage,
        // if the response comes with a body like '{"error":"API Key Not Found"}'
        // then use as error message otherwise stick with what we have from got
        message: err.response.body ? err.response.body.trim() : err.message,
      });
    }
    return acc;
  }

  /**
   * iterateOrganizations gets all Rumble Organizations from the /account/orgs endpoint
   * and then calls the iteratee for each organization
   *
   * @returns Promise for a RumbleOrganization
   */
  public async iterateOrganizations(
    iteratee: ResourceIteratee<RumbleOrganization>,
  ): Promise<void> {
    const uri = '/api/v1.0/account/orgs';
    const endpoint = BASE_URI + uri;
    const request = this.createRequest(endpoint);

    const organizations: RumbleOrganization[] = await this.getEntities(request);

    for (const org of organizations) {
      await iteratee(org);
    }
  }

  private async getEntities(
    request: CancelableRequest<Response<string>>,
  ): Promise<any> {
    let response: any;
    try {
      const result = await request;
      response = JSON.parse(result.body);
    } catch (err) {
      throw new IntegrationProviderAPIError({
        cause: err,
        endpoint: err.response.requestUrl,
        status: err.response.statusCode,
        statusText: err.response.statusMessage,
        message: err.response.body ? err.response.body.trim() : err.message,
      });
    }
    return response;
  }

  private createRequest(endpoint: string) {
    return got.get(endpoint, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${this.options.config.accountAPIKey}`,
      },
    });
  }
}

export function createAPIClient(options: APIClientOptions): APIClient {
  return new APIClient(options);
}
