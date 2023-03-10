import {
  IntegrationProviderAPIError,
  IntegrationProviderAuthenticationError,
} from '@jupiterone/integration-sdk-core';

import got, { HTTPError, OptionsOfTextResponseBody } from 'got';
import { pipeline } from 'stream';
import { promisify } from 'util';
import { parser } from 'stream-json/jsonl/Parser';
import {
  APIClientOptions,
  RunZeroAccount,
  RunZeroAsset,
  RunZeroOrganization,
  RunZeroSite,
  RunZeroUser,
} from '../types';
import { APIClient, BASE_URI, ResourceIteratee } from '.';

/**
 * An APIClient maintains authentication state and provides an interface to
 * third party data APIs.
 *
 * It is recommended that integrations wrap provider data APIs to provide a
 * place to handle error responses and implement common patterns for iterating
 * resources.
 */
export class AccountAPIKeyClient implements APIClient {
  constructor(readonly options: APIClientOptions) {}

  /**
   * Since there are several calls made to /account/orgs
   * it is worth caching the results
   */
  orgCache: { [key: string]: RunZeroOrganization[] } = {};

  public async verifyAuthentication(): Promise<void> {
    try {
      await this.getOrganizations();
    } catch (err) {
      throw new IntegrationProviderAuthenticationError({
        cause: err,
        endpoint: err.endpoint,
        status: err.status,
        statusText: err.statusText,
      });
    }
  }

  /**
   * getAccount gets account info from the runZero API by making a call to /account/orgs
   * @returns a Promise for a runZeroAccount
   */
  public async getAccount(): Promise<RunZeroAccount> {
    // We use the organizations endpoint to get client_id for the account
    // since there is not an account information endpoint
    const organizations = await this.getOrganizations();

    const acc: RunZeroAccount = {
      // Every account is guaranteed at least one Organization
      // so we can expect one organization to read the client_id from
      // See https://www.runzero.com/docs/sites/
      id: organizations[0].client_id,

      // we use integration name for the account name
      // since there is not an obvious name value from
      // the runZero api. accountId tag might work as well.
      name: this.options.name,
    };
    return acc;
  }

  /**
   * iterateOrganizations gets all runZero Organizations from the /account/orgs endpoint
   * and then calls the iteratee for each organization
   *
   * @param iteratee the function called for each resource
   * @returns Promise<void>
   */
  public async iterateOrganizations(
    iteratee: ResourceIteratee<RunZeroOrganization>,
  ): Promise<void> {
    const organizations = await this.getOrganizations();

    for (const org of organizations) {
      await iteratee(org);
    }
  }

  /**
   * iterateUsers gets all runZero Users from the /account/orgs endpoint
   * and then calls the iteratee for each user
   *
   * @param iteratee the function called for each User
   * @returns Promise<void>
   */
  public async iterateUsers(
    iteratee: ResourceIteratee<RunZeroUser>,
  ): Promise<void> {
    const uri = '/account/users';
    const endpoint = BASE_URI + uri;
    const users = await this.callApi({ url: endpoint });

    for (const user of users) {
      await iteratee(user);
    }
  }

  /**
   * iterateSits gets all runZero Sites from the /account/sites endpoint
   * and then calls the iteratee for each site
   *
   * @param iteratee the function called for each Site
   * @return Promise<void>
   */
  public async iterateSites(
    iteratee: ResourceIteratee<RunZeroSite>,
  ): Promise<void> {
    const uri = '/account/sites';
    const endpoint = BASE_URI + uri;
    const sites = await this.callApi({ url: endpoint });

    for (const site of sites) {
      await iteratee(site);
    }
  }

  /**
   * iterateAssets gets all runZeroAssets for an organization from the /export/org/assets.json
   * endpoint and then calls the iteratee for each site. This is repeated for each organization
   * that has an export token.
   * @param iteratee the function called for each sites
   */
  public async iterateAssets(
    iteratee: ResourceIteratee<RunZeroAsset>,
  ): Promise<void> {
    const endpoint = BASE_URI + '/export/org/assets.jsonl';

    const tokens = await this.getExportTokens();
    for (const token of tokens) {
      this.options.logger.info('Fetching assets from export...');
      const request = got.stream(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });
      const jsonlParser = parser();
      const promisedPipeline = promisify(pipeline);
      const pipe = promisedPipeline(request, jsonlParser);
      try {
        for await (const { value } of jsonlParser) {
          await iteratee(value);
        }
      } catch (err) {
        if (err instanceof HTTPError) {
          throw new IntegrationProviderAPIError({
            cause: err,
            status: err.response.statusCode,
            statusText: err.response.statusMessage as string,
            endpoint: endpoint,
          });
        } else {
          throw err;
        }
      } finally {
        // we need to do finally to ensure the pipe is awaited
        // and the error in the pipe can be handled
        try {
          await pipe;
        } catch (err) {
          this.options.logger.error({ err }, 'Error in pipe');
        }
      }
    }
  }

  /**
   * getExportTokens ingest export tokens from the /account/organizations endpoint
   * @returns Promise<string[]> an array of export tokens
   */
  public async getExportTokens(): Promise<string[]> {
    const organizations = await this.getOrganizations();
    const tokens: string[] = [];
    for (const org of organizations) {
      // check if the token is empty string or null
      if (org.export_token) {
        tokens.push(org.export_token);
      } else {
        this.options.logger.warn(
          `An organization with name '${org.name}' and id '${org.id}' does not have export token. Asset, Services, and Wireless data for this organization won't be loaded. To generate an export token, follow the steps in jupiterone.md`,
        );
      }
    }
    return tokens;
  }

  private async getOrganizations(): Promise<RunZeroOrganization[]> {
    const uri = '/account/orgs';
    const endpoint = BASE_URI + uri;

    if (endpoint in this.orgCache) {
      return this.orgCache[endpoint];
    }
    const response = await this.callApi({ url: endpoint });

    // if we succeeded cache the results
    this.orgCache[endpoint] = response;
    return this.orgCache[endpoint];
  }

  /**
   * callApi is a generic method for making calls to the runZero API.
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
        Authorization: `Bearer ${this.options.instance.config.accountAPIKey}`,
      },
      ...callApiOptions,
    });

    let response: any;
    try {
      const result = await request;
      response = JSON.parse(result.body);
      return response;
    } catch (err) {
      throw new IntegrationProviderAPIError({
        cause: err,
        // we use plain strings for urls so this is valid
        endpoint: callApiOptions.url as string,
        status: err.response?.statusCode,
        statusText: err.response?.statusMessage,
      });
    }
  }
}
