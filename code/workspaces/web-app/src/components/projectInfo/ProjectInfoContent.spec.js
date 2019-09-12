import React from 'react';
import { createMount } from '@material-ui/core/test-utils';
import ProjectInfoContent from './ProjectInfoContent';

describe('ProjectInfoContent', () => {
  const projectInfo = {
    id: 'project2',
    displayName: '"project2" is the ID of this',
    description: 'This is the second project.',
    type: 'project',
    status: 'ready',
  };

  function fullRender() {
    const mount = createMount();
    const props = { projectInfo };

    return mount(
      <ProjectInfoContent {...props} />,
    );
  }

  it('correctly renders correct snapshot', () => {
    expect(fullRender()).toMatchSnapshot();
  });
});
