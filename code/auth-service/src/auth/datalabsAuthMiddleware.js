import jwt from 'express-jwt';
import { PUBLIC_KEY } from '../controllers/authorisation';

const datalabsAuthMiddleware = jwt({
  secret: PUBLIC_KEY,
  audience: 'https://api.datalabs.nerc.ac.uk/',
  issuer: 'https://authorisation.datalabs.nerc.ac.uk/',
  algorithms: ['RS256'],
});

export default datalabsAuthMiddleware;
