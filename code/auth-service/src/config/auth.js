import fs from 'fs';
import config from './config';

export const PRIVATE_KEY = fs.readFileSync(config.get('privateKey'));
export const PUBLIC_KEY = fs.readFileSync(config.get('publicKey'));
export const algorithm = 'RS256';
export const audience = 'https://api.datalabs.ceh.ac.uk/';
export const expiresIn = '2m';
export const issuer = 'https://authorisation.datalabs.ceh.ac.uk/';
export const keyid = 'datalabs-authorisation';
