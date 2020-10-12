import React from 'react';
import { shallow } from 'enzyme';
import RestartStackDialog from './RestartStackDialog';

describe('RestartStackDialog', () => {
  const shallowRender = props => shallow(
    <RestartStackDialog {...props} />,
  );

  it('renders to match snapshot', () => {
    const render = shallowRender({
      onSubmit: jest.fn().mockName('onSubmit'),
      title: 'Dialog title',
      body: 'Dialog body',
      onCancel: jest.fn().mockName('onCancel'),
    });

    expect(render).toMatchSnapshot();
  });
});
