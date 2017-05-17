import webpack from 'webpack';
import { chalkError, chalkProcessing, chalkSuccess, chalkWarning } from './chalkConfig';
import config from '../api.webpack.node.config.prod';

process.env.NODE_ENV = 'production';

console.log(chalkProcessing('Starting webpack build...'));

webpack(config).run((error, stats) => {
  if (error) {
    console.log(chalkError(error));
    return 1;
  }

  const jsonStats = stats.toJson();

  if (jsonStats.hasErrors) {
    return jsonStats.errors.map(err => console.log(chalkError(err)));
  }

  if (jsonStats.hasWarnings) {
    return jsonStats.warnings.map(warning => console.log(chalkWarning(warning)));
  }

  console.log(`Webpack stats: ${stats}`);

  console.log(chalkSuccess('The api sucessfully compilied in production mode.'));

  return 0;
});
