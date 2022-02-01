import React from 'react';
import { render } from '../../testUtils/renderTests';
import { PureEditProject } from './EditProjectDetails';

jest.mock('../common/form/controls', () => ({
  UpdateFormControls: props => (<>UpdateFormControls Mock {JSON.stringify(props)}</>),
}));
jest.mock('redux-form', () => ({
  ...jest.requireActual('redux-form'),
  Field: props => (<>Field Mock: {JSON.stringify(props)}</>),
}));

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
    expect(render(
      <PureEditProject
        handleSubmit={jest.fn().mockName('handleSubmit')}
        onCancel={jest.fn().mockName('onCancel')}
        classes={classes}
        project={project}
      />,
    ).container).toMatchSnapshot();
  });
});
