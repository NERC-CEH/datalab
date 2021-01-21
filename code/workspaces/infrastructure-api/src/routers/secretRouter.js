import express from 'express';
import { service } from 'service-chassis';
import { getStackSecret, stackSecretValidator } from '../controllers/secretController';

const { errorWrapper } = service.middleware;

const secretRouter = express.Router();

secretRouter.get(
  '/stack',
  stackSecretValidator,
  errorWrapper(getStackSecret),
);

export default secretRouter;
