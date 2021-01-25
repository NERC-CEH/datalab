import express from 'express';
import { service } from 'service-chassis';
import { getStackSecret, getStackSecretValidator } from '../controllers/secretController';

const { errorWrapper } = service.middleware;

const secretRouter = express.Router();

secretRouter.get(
  '/stack',
  getStackSecretValidator(),
  errorWrapper(getStackSecret),
);

export default secretRouter;
