import * as dotenv from 'dotenv';
import * as path from 'path';
import { IntegrationConfig } from '../src/config';

if (process.env.LOAD_ENV) {
  dotenv.config({
    path: path.join(__dirname, '../.env'),
  });
}

const DEFAULT_ACCOUNT_API_KEY = 'dummy-rumble-account-api-key';

export const integrationConfig: IntegrationConfig = {
  accountAPIKey: process.env.ACCOUNT_API_KEY || DEFAULT_ACCOUNT_API_KEY,
};
