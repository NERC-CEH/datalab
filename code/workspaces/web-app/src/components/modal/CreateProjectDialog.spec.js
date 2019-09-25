import React from 'react';
import { shallow } from 'enzyme';
import CreateProjectDialog from './CreateProjectDialog';

describe('CreateProjectDialog', () => {
  it('renders to match snapshot passing function props to form', () => {
    expect(shallow(<CreateProjectDialog
      onSubmit={jest.fn().mockName('onSubmit')}
      onCancel={jest.fn().mockName('onCancel')}
    />)).toMatchSnapshot();
  });
});
