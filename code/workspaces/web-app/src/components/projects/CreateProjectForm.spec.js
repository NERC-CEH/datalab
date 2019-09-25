import React from 'react';
import { shallow } from 'enzyme';
import { PureCreateProjectForm } from './CreateProjectForm';

describe('CreateProjectForm', () => {
  const classes = {
    input: 'input',
    button: 'button',
    form: 'form',
    buttonContainer: 'buttonContainer',
  };

  it('renders to match snapshot', () => {
    expect(shallow(
      <PureCreateProjectForm
        handleSubmit={jest.fn().mockName('handleSubmit')}
        onCancel={jest.fn().mockName('onCancel')}
        classes={classes}
      />,
    )).toMatchSnapshot();
  });
});
