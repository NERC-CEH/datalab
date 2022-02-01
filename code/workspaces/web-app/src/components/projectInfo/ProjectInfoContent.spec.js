import React from 'react';
import { render } from '../../testUtils/renderTests';
import ProjectInfoContent from './ProjectInfoContent';

describe('ProjectInfoContent', () => {
  const projectInfo = {
    key: 'project2',
    name: '"project2" is the ID of this',
    description: 'This is the second project.',
  };

  it('correctly renders correct snapshot', () => {
    const props = { projectInfo };
    expect(render(<ProjectInfoContent {...props} />).container).toMatchSnapshot();
  });
});
