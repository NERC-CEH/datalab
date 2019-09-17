import React from 'react';
import { createShallow } from '@material-ui/core/test-utils';
import ProjectInfoContent from './ProjectInfoContent';

describe('ProjectInfoContent', () => {
  const projectInfo = {
    key: 'project2',
    name: '"project2" is the ID of this',
    description: 'This is the second project.',
  };

  function shallowRender() {
    const shallow = createShallow();
    const props = { projectInfo };

    return shallow(<ProjectInfoContent {...props} />);
  }

  it('correctly renders correct snapshot', () => {
    expect(shallowRender()).toMatchSnapshot();
  });
});
