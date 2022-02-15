import {
  IntegrationProviderAPIError,
  IntegrationProviderAuthenticationError,
} from '@jupiterone/integration-sdk-core';

import {
  APIClientOptions,
  RumbleAccount,
  RumbleOrganization,
  RumbleUser,
} from './types';
import got, { OptionsOfTextResponseBody } from 'got';

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
    const request = got.get(endpoint, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${this.options.config.accountAPIKey}`,
      },
    });

    try {
      await request;
    } catch (err) {
      throw new IntegrationProviderAuthenticationError({
        cause: err,
        endpoint: BASE_URI + uri,
        status: err.response.statusCode,
        // if the response comes with a body like '{"error":"API Key Not Found"}'
        // then we will append it to statusText for additional context in error message
        statusText:
          err.response.statusMessage +
          (err.response.body ? `\nBody: ${err.response.body.trim()}` : ''),
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

    // We use the organizations endpoint to get client_id for the account
    // since there is not an account information endpoint
    const organizations = await this.callApi({ url: endpoint });

    const acc: RumbleAccount = {
      // Every account is guaranteed at least one Organization
      // so we can expect one organization to read the client_id from
      // See https://www.rumble.run/docs/organizations-and-sites/
      id: organizations[0].client_id,

      // we use integration name for the account name
      // since there is not an obvious name value from
      // the rumble api. accountId tag might work as well.
      name: this.options.name,
    };
    return acc;
  }

  /**
   * iterateOrganizations gets all Rumble Organizations from the /account/orgs endpoint
   * and then calls the iteratee for each organization
   *
   * @returns Promise<void>
   */
  public async iterateOrganizations(
    iteratee: ResourceIteratee<RumbleOrganization>,
  ): Promise<void> {
    const uri = '/api/v1.0/account/orgs';
    const endpoint = BASE_URI + uri;

    const organizations = await this.callApi({ url: endpoint });

    for (const org of organizations) {
      await iteratee(org);
    }
  }

  /**
   * iterateUsers gets all Rumble Users from the /account/orgs endpoint
   * and then calls the iteratee for each user
   *
   * @returns Promise<void>
   */
  public async iterateUsers(
    iteratee: ResourceIteratee<RumbleUser>,
  ): Promise<void> {
    const uri = '/api/v1.0/account/users';
    const endpoint = BASE_URI + uri;
    const users = await this.callApi({ url: endpoint });

    for (const user of users) {
      await iteratee(user);
    }
  }

  /**
   * callApi is a generic method for making calls to the Rumble API.
   * The function takes options. The only mandatory option is `url`.
   * Default headers will be set if none are passed in the options.
   *
   * @param callApiOptions Options for the got.get method to use when calling the API. The url field must be set for a successful call. Headers are set by default but can be overridden by the caller setting them.
   *
   * @returns Promise<any>, which will be a JSON formatted response from the API
   */
  private async callApi(
    callApiOptions: OptionsOfTextResponseBody,
  ): Promise<any> {
    const request = got.get({
      // we set default headers, but the caller can place custom headers in callApiOptions
      // and this will be overwritten
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${this.options.config.accountAPIKey}`,
      },
      ...callApiOptions,
    });

    let response: any;
    try {
      const result = await request;
      response = JSON.parse(result.body);
    } catch (err) {
      throw new IntegrationProviderAPIError({
        cause: err,
        endpoint: err.response.requestUrl,
        status: err.response.statusCode,
        statusText:
          err.response.statusMessage +
          (err.response.body ? `\nBody: ${err.response.body.trim()}` : ''),
      });
    }
    return response;
  }
}

export function createAPIClient(options: APIClientOptions): APIClient {
  return new APIClient(options);
}
