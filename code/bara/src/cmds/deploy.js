import yargs from 'yargs';

export const command = 'deploy [k8s_manifest]';
export const describe = 'Deploy a kubernetes manifest';

export const builder = () => yargs.usage('Usage: $0 deploy -t <template> -c <config>')
  .option('t', { alias: 'template', demand: true, describe: 'Kubernetes deployment template file to use', type: 'string' })
  .option('c', { alias: 'config', demand: true, describe: 'Environment configuration file to use', type: 'string' })
  .help('?')
  .alias('?', 'help')
  .argv;

export const handler = (argv) => {
  console.log(argv);
};

