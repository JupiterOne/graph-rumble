import { accountSteps } from './account';
import { assetSteps } from './asset';
import { organizationsSteps } from './organizations';
import { siteSteps } from './sites';
import { userSteps } from './users';

const integrationSteps = [
  ...accountSteps,
  ...organizationsSteps,
  ...userSteps,
  ...siteSteps,
  ...assetSteps,
];

export { integrationSteps };
