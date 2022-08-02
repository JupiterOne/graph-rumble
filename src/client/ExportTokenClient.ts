import {
  IntegrationProviderAPIError,
  IntegrationProviderAuthenticationError,
} from '@jupiterone/integration-sdk-core';
import got, { HTTPError } from 'got';
import { OptionsOfTextResponseBody } from 'got/dist/source';
import { APIClient, BASE_URI, ResourceIteratee } from '.';
import {
  APIClientOptions,
  RumbleAccount,
  RumbleAsset,
  RumbleOrganization,
  RumbleSite,
  RumbleUser,
} from '../types';
import { pipeline } from 'stream';
import { promisify } from 'util';
import { parser } from 'stream-json/jsonl/Parser';

export class ExportTokenApiClient implements APIClient {
  constructor(readonly options: APIClientOptions) {}

  public async verifyAuthentication(): Promise<void> {
    const uri = '/export/org/sites.json';
    const endpoint = BASE_URI + uri;

    const token = this.options.instance.config.exportToken;
    try {
      await this.callApi({
        url: endpoint,
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });
    } catch (err) {
      throw new IntegrationProviderAuthenticationError({
        cause: err,
        endpoint: err.endpoint,
        status: err.status,
        statusText: err.statusText,
      });
    }
  }

  public getAccount(): RumbleAccount {
    return {
      id: this.options.instance.id,
      name: this.options.name,
    };
  }

  public async iterateSites(
    iteratee: ResourceIteratee<RumbleSite>,
  ): Promise<void> {
    const uri = '/export/org/sites.json';
    const endpoint = BASE_URI + uri;

    const token = this.options.instance.config.exportToken;

    const sites = await this.callApi({
      url: endpoint,
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });

    for (const site of sites) {
      await iteratee(site);
    }
  }

  async iterateOrganizations(
    iteratee: ResourceIteratee<RumbleOrganization>,
  ): Promise<void> {
    return await Promise.resolve();
  }

  async iterateUsers(iteratee: ResourceIteratee<RumbleUser>): Promise<void> {
    return await Promise.resolve();
  }

  public async iterateAssets(iteratee: ResourceIteratee<RumbleAsset>) {
    const endpoint = BASE_URI + '/export/org/assets.jsonl';
    await this.streamJsonl(endpoint, iteratee);
  }

  private async callApi(
    callApiOptions: OptionsOfTextResponseBody,
  ): Promise<any> {
    const request = got.get({
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${this.options.instance.config.exportToken}`,
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
        endpoint: callApiOptions.url as string,
        status: err.response?.statusCode,
        statusText: err.response?.statusMessage as string,
      });
    }
  }

  private async streamJsonl<T>(
    endpoint: string,
    iteratee: ResourceIteratee<T>,
  ): Promise<void> {
    const request = got.stream(endpoint, {
      headers: {
        Authorization: `Bearer ${this.options.instance.config.exportToken}`,
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
          status: err.response?.statusCode,
          statusText: err.response?.statusMessage as string,
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
