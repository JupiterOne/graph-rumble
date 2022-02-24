import { accountSteps } from './account';
import { organizationsSteps } from './organizations';
import { siteSteps } from './sites';
import { userSteps } from './users';

const integrationSteps = [
  ...accountSteps,
  ...organizationsSteps,
  ...userSteps,
  ...siteSteps,
];

export { integrationSteps };
