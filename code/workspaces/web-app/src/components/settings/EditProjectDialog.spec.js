import React from 'react';
import { shallow } from 'enzyme';
import EditProjectDialog from './EditProjectDialog';

describe('EditProjectDialog', () => {
  const state = {
    open: true,
    values: {},
  };
  const title = 'Example Title';
  const body = 'Warning about editing this project accidentically';

  it('renders to match snapshot', () => {
    expect(shallow(
      <EditProjectDialog
        onSubmit={jest.fn().mockName('onSubmit')}
        onCancel={jest.fn().mockName('onCancel')}
        state={state}
        title={title}
        body={body}
      />,
    )).toMatchSnapshot();
  });
});
