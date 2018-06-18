import fs from 'fs';
import yaml from 'js-yaml';

const knownUsersFileLocation = './src/knownUsers/knownUsers.yml';

let knownUsers = [];

if (fs.existsSync(knownUsersFileLocation)) {
  knownUsers = yaml.safeLoad(fs.readFileSync(knownUsersFileLocation));
}

const getKnownUsers = () => knownUsers;

export default getKnownUsers;
