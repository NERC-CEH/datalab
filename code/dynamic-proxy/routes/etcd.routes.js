import express from 'express';
import * as etcdController from '../controllers/etcd.controller';

const router = express.Router();

router.get('/', etcdController.listRoutes);
router.post('/', etcdController.addRoute);
router.delete('/', etcdController.deleteRoute);

export default router;
