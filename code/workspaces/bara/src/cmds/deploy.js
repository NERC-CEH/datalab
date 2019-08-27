import yargs from 'yargs';
import chalk from 'chalk';
import kubernetesService from '../kubernetes/kubernetesService';

export const command = 'deploy [k8s_manifest]';
export const describe = 'Deploy a kubernetes manifest';

export const builder = () => yargs.usage('Usage: $0 deploy -t <template> -c <config>')
  .option('t', { alias: 'template', demand: true, describe: 'Kubernetes deployment template file to use', type: 'string' })
  .option('c', { alias: 'config', demand: true, describe: 'Environment configuration file to use', type: 'string' })
  .option('r', { alias: 'dryrun', demand: false, default: false, describe: 'Build templates without applying to cluster', type: 'boolean' })
  .help('?')
  .alias('?', 'help')
  .argv;

export const handler = ({ template, config, dryrun }) => {
  console.log(chalk.blue(`Using template: ${template}`));
  console.log(chalk.blue(`Using config: ${config}`));
  if (dryrun) {
    console.log(chalk.yellow('Dry run - Templates will not be applied'));
  }

  kubernetesService.deployManifests(template, config, dryrun);
};

