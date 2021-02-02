import React from 'react';
import { shallow } from 'enzyme';
import ConfirmDialog from './ConfirmDialog';

describe('ConfirmDialog', () => {
  const state = {
    open: true,
    values: {},
  };
  const title = 'Example Title';
  const body = 'Warning about editing this project accidentally';

  it('renders to match snapshot', () => {
    expect(shallow(
      <ConfirmDialog
        onSubmit={jest.fn().mockName('onSubmit')}
        onCancel={jest.fn().mockName('onCancel')}
        state={state}
        title={title}
        body={body}
      />,
    )).toMatchSnapshot();
  });
});
