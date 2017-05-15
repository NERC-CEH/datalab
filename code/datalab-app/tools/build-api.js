import webpack from 'webpack';
import config from '../api.webpack.node.config.prod';

process.env.NODE_ENV = 'production';

webpack(config).run((error, stats) => {
  if (error) {
    console.log(error);
    return 1;
  }

  console.log(`Webpack stats: ${stats}`);

  return 0;
});
