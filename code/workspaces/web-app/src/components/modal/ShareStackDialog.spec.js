import React from 'react';
import { render, fireEvent, screen, within } from '../../testUtils/renderTests';
import ShareStackDialog from './ShareStackDialog';

describe('ShareStackDialog', () => {
  const state = {
    open: true,
    values: {},
  };
  const title = 'Example Title';
  const body = 'Warning about sharing this resource';

  it('renders to match snapshot', () => {
    render(
      <ShareStackDialog
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
