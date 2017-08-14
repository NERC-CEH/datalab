import fs from 'fs-extra-promise';
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
    .then(renderedTemplate => fs.writeFileAsync(targetFilename, renderedTemplate))
    .then(() => execAsync(`kubectl apply -f ${targetFilename}`))
    .then(console.log)
    .catch(console.error);
}

function prepareWorkingSpace() {
  if (!fs.existsSync(executionDir)) {
    fs.mkdirSync(executionDir);
  }
}

function getTargetFileName(sourcePath) {
  return `${executionDir}/${path.basename(sourcePath)}`;
}

export default deployManifest;
