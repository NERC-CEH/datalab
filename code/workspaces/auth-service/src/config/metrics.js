import { Counter } from 'prom-client';

const permissionTokenCounter = new Counter({
  name: 'permission_token_counter',
  help: 'The number of permission tokens issued',
});

// eslint-disable-next-line import/prefer-default-export
export { permissionTokenCounter };
