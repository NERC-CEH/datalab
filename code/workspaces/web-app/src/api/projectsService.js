import { gqlQuery } from './graphqlClient';
import errorHandler from './graphqlErrorHandler';

const dummyProjects = [
  {
    id: 'project',
    displayName: 'The project with id "project"',
    description: 'Once upon a time there was only one...',
    type: 'project',
    status: 'ready',
  },
  {
    id: 'project2',
    displayName: '"project2" is the ID of this',
    description: 'This is the second project.',
    type: 'project',
    status: 'ready',
  },
  {
    id: 'project3',
    displayName: 'And this is "project3"',
    description: 'This is another project.',
    type: 'project',
    status: 'ready',
  },
  {
    id: 'projectX',
    displayName: 'What?',
    description: 'No-one has permission to see this...',
    type: 'project',
    status: 'ready',
  },
];

function loadProjects() {
  const query = `
    LoadProjects {
      projects {
        id, key, name, description
      }
    }`;

  return gqlQuery(query)
    .then(errorHandler('data.projects'));
}

function loadProjectInfo(projectKey) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        currentProject: dummyProjects.filter(project => project.id === projectKey)[0],
      });
    }, 2000);
  });
}

export default { loadProjects, loadProjectInfo };
