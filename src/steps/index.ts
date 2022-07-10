import { accountSteps } from './account';
import { assetSteps } from './asset';
import { organizationsSteps } from './organizations';
import { servicesStep } from './services';
import { siteSteps } from './sites';
import { userSteps } from './users';

const integrationSteps = [
  ...accountSteps,
  ...organizationsSteps,
  ...userSteps,
  ...siteSteps,
  ...assetSteps,
  ...servicesStep,
];

export { integrationSteps };
