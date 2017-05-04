import express from 'express';
import * as etcdController from './etcd.controller';

const router = express.Router();

router.get('/', etcdController.listRoutes);
router.post('/', etcdController.addRoute);
router.delete('/', etcdController.deleteRoute);
router.delete('/deleteAll', etcdController.deleteAllRoutes);

export default router;
