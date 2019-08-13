import { replaceSubdomain } from '../core/getDomainInfo';

const DISCOURSE = { displayName: 'Discourse', href: replaceSubdomain('discourse', 'https://www.discourse.org/') };
const DOCKER_HUB = { displayName: 'Docker Hub', href: 'https://hub.docker.com/u/nerc/' };
const GITHUB = { displayName: 'GitHub', href: 'https://github.com/NERC-CEH/datalab' };
const SLACK = { displayName: 'Slack', href: 'https://nerc-datalabs.slack.com/' };

export default {
  DISCOURSE,
  DOCKER_HUB,
  GITHUB,
  SLACK,
};
