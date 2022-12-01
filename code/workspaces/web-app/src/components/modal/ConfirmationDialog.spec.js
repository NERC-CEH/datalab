import React from 'react';
import { render, screen } from '../../testUtils/renderTests';
import ConfirmationDialog from './ConfirmationDialog';

describe('ConfirmationDialog', () => {
  const shallowRender = (props) => {
    render(<ConfirmationDialog {...props} />);
    return screen.getByRole('dialog');
  };

  it('renders to match snapshot', () => {
    const container = shallowRender({
      onSubmit: jest.fn().mockName('onSubmit'),
      title: 'Dialog title',
      body: 'Dialog body',
      onCancel: jest.fn().mockName('onCancel'),
    });

    expect(container).toMatchSnapshot();
  });
});
