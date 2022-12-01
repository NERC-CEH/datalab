import React from 'react';
import { render, screen } from '../../testUtils/renderTests';
import ConfirmDialog from './ConfirmDialog';

describe('ConfirmDialog', () => {
  const state = {
    open: true,
    values: {},
  };
  const title = 'Example Title';
  const body = 'Warning about editing this project accidentally';

  it('renders to match snapshot', () => {
    render(
      <ConfirmDialog
        onSubmit={jest.fn().mockName('onSubmit')}
        onCancel={jest.fn().mockName('onCancel')}
        state={state}
        title={title}
        body={body}
      />,
    );

    expect(screen.getByRole('dialog')).toMatchSnapshot();
  });
});
