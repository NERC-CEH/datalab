import fs from 'fs-extra-promise';
import del from 'del';
import chalk from 'chalk';
import path from 'path';
import { render } from 'mustache';
import util from 'util';
import { exec } from 'child_process';
import YAML from 'yamljs';

const execAsync = util.promisify(exec);
const executionDir = '.bara';

function deployManifests(templatePath, configPath, dryrun) {
  prepareWorkingSpace();
  const manifests = buildManifestList(templatePath);
  const promises = manifests.map(manifest => deployManifest(manifest, configPath, dryrun));

  Promise.all(promises)
    .then(tidyUp(dryrun))
    .catch(logError);
}

function buildManifestList(templatePath) {
  const manifests = [];
  if (fs.lstatSync(templatePath).isDirectory()) {
    console.log(chalk.blue(`Executing on template directory ${templatePath}`));
    fs.readdirSync(templatePath).forEach((file) => {
      if (file.includes('.template.yml')) {
        manifests.push(`${templatePath}/${file}`);
      }
    });
  } else {
    console.log(chalk.blue(`Executing on single template ${templatePath}`));
    manifests.push(templatePath);
  }
  return manifests;
}

function deployManifest(templatePath, configPath, dryrun) {
  const properties = YAML.load(configPath);
  const targetFilename = getTargetFileName(templatePath);

  return fs.readFileAsync(templatePath)
    .then(data => data.toString())
    .then(template => render(template, properties))
    .then(writeRenderedTemplate(targetFilename))
    .then(executeKubectl(targetFilename, dryrun))
    .then(processResponse);
}

function prepareWorkingSpace() {
  if (fs.existsSync(executionDir)) {
    console.log(chalk.yellow(`Deleting existing ${executionDir} directory`));
    del.sync(executionDir);
  }
  console.log(chalk.blue(`Creating ${executionDir} directory`));
  fs.mkdirSync(executionDir);
}

function getTargetFileName(sourcePath) {
  let filename = path.basename(sourcePath);
  filename = filename.replace('.template', '');
  return `${executionDir}/${filename}`;
}

function writeRenderedTemplate(targetFilename) {
  return (renderedContent) => {
    console.log(chalk.blue(`Writing rendered template to : ${targetFilename}`));
    fs.writeFileAsync(targetFilename, renderedContent);
  };
}

function executeKubectl(targetFilename, dryrun) {
  return () => {
    if (dryrun) {
      console.log(chalk.yellow(`Dry Run - Skipping deployment : ${targetFilename}`));
      return { stdout: 'Template skipped' };
    }

    console.log(chalk.blue(`Executing kubectl for template : ${targetFilename}`));
    return execAsync(`kubectl apply -f ${targetFilename}`);
  };
}

function processResponse(response) {
  if (response.stdout) {
    console.log(chalk.green(response.stdout));
  } else {
    logError(response.stderr);
  }
}

function logError(error) {
  console.log(chalk.red(error));
}

function tidyUp(dryrun) {
  return () => {
    if (!dryrun && fs.existsSync(executionDir)) {
      console.log(chalk.blue(`Tidy up ${executionDir} directory`));
      del.sync(executionDir);
    }
  };
}

export default { deployManifests };
