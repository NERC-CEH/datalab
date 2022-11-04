import React from 'react';
import { render } from '../../testUtils/renderTests';
import { PureCreateProjectForm } from './CreateProjectForm';

jest.mock('../common/form/controls', () => ({
  CreateFormControls: props => (<>CreateFormControls Mock {JSON.stringify(props)}</>),
}));
jest.mock('redux-form', () => ({
  ...jest.requireActual('redux-form'),
  Field: props => (<>Field Mock: {JSON.stringify(props)}</>),
}));

describe('CreateProjectForm', () => {
  const classes = {
    input: 'input',
    button: 'button',
    form: 'form',
    buttonContainer: 'buttonContainer',
  };

  it('renders to match snapshot', () => {
    expect(render(
      <PureCreateProjectForm
        handleSubmit={jest.fn().mockName('handleSubmit')}
        onCancel={jest.fn().mockName('onCancel')}
        classes={classes}
      />,
    ).container).toMatchSnapshot();
  });

  it('renders request form correctly', () => {
    expect(render(
      <PureCreateProjectForm
        handleSubmit={jest.fn().mockName('handleSubmit')}
        onCancel={jest.fn().mockName('onCancel')}
        classes={classes}
        requestOnly={true}
      />,
    ).container).toMatchSnapshot();
  });
});
