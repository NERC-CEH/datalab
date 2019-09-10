function loadProjects() {
  return new Promise(resolve => resolve([
    {
      id: 'project',
      displayName: 'The project with id "project"',
      description: 'Once upon a time there was only one...',
      type: 'project',
    },
    {
      id: 'project2',
      displayName: '"project2" is the ID of this',
      description: 'This is the second project.',
      type: 'project',
    },
    {
      id: 'project3',
      displayName: 'And this is "project3"',
      description: 'This is another project.',
      type: 'project',
    },
    {
      id: 'projectX',
      displayName: 'What?',
      description: 'No-one has permission to see this...',
      type: 'project',
    },
  ]));
}

export default { loadProjects };
