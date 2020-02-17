import React from 'react';
import { shallow } from 'enzyme';
import { PureEditProject } from './EditProjectDetails';

describe('EditProjectDetails', () => {
  const classes = {
    input: 'input',
    button: 'button',
    form: 'form',
    buttonContainer: 'buttonContainer',
  };

  const project = {
    name: 'test-project',
    description: 'description',
    collaborationLink: 'example.com',
  };

  it('renders to match snapshot', () => {
    expect(shallow(
      <PureEditProject
        handleSubmit={jest.fn().mockName('handleSubmit')}
        onCancel={jest.fn().mockName('onCancel')}
        classes={classes}
        project={project}
      />,
    )).toMatchSnapshot();
  });
});
