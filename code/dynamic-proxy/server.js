import express from 'express';
import bodyParser from 'body-parser';
import etcdRoutes from './api/etcd.routes';
import startProxy from './proxy/proxy.js';
import config from './config';
import bunyan from 'bunyan';

const logger = bunyan.createLogger({name: 'proxy.api'});

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/routes', etcdRoutes);

const apiPort = config.get('apiPort');

app.listen(apiPort, () => logger.info(`Proxy API listening on port ${apiPort}`));

startProxy();
