import express from 'express';
import bodyParser from 'body-parser';
import etcdRoutes from './routes/etcd.routes';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/routes', etcdRoutes);

const apiPort = process.env.PROXY_API_PORT || '3000';

app.listen(apiPort, () => console.log(`Proxy API listening on port ${apiPort}!`));
