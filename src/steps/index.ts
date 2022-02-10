import { accountSteps } from './account';
import { organizationsSteps } from './organizations';
import { userSteps } from './users';

const integrationSteps = [...accountSteps, ...organizationsSteps, ...userSteps];

export { integrationSteps };
