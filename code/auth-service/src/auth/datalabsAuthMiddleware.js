import jwt from 'express-jwt';
import {
  PUBLIC_KEY,
  audience,
  issuer,
  algorithm,
} from '../config/auth';

const datalabsAuthMiddleware = jwt({
  secret: PUBLIC_KEY,
  audience,
  issuer,
  algorithms: [algorithm],
});

export default datalabsAuthMiddleware;
