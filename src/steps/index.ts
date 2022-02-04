import { accountSteps } from './account';
import { organizationsSteps } from './organizations';

const integrationSteps = [...accountSteps, ...organizationsSteps];

export { integrationSteps };
