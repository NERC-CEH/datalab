import yargs from 'yargs';

if (process.env.KUBECONFIG) {
  console.log(`KUBECONFIG environment set to: ${process.env.KUBECONFIG}`);
}

function main() {
  return yargs.commandDir('cmds')
    .demandCommand()
    .help()
    .argv;
}

main();
