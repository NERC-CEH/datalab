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

function deployManifest(templatePath, configPath) {
  prepareWorkingSpace();
  const properties = YAML.load(configPath);
  const targetFilename = getTargetFileName(templatePath);

  fs.readFileAsync(templatePath)
    .then(data => data.toString())
    .then(template => render(template, properties))
    .then(writeRenderedTemplate(targetFilename))
    .then(executeKubectl(targetFilename))
    .then(processResponse)
    .then(tidyUp)
    .catch(console.error);
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

function executeKubectl(targetFilename) {
  return () => {
    console.log(chalk.blue(`Executing kubectl for template : ${targetFilename}`));
    return execAsync(`kubectl apply -f ${targetFilename}`);
  };
}

function processResponse(response) {
  if (response.stdout) {
    console.log(chalk.green(response.stdout));
  } else {
    console.log(chalk.red(response.stderr));
  }
}

function tidyUp() {
  if (fs.existsSync(executionDir)) {
    console.log(chalk.blue(`Tidy up ${executionDir} directory`));
    del.sync(executionDir);
  }
}

export default deployManifest;
