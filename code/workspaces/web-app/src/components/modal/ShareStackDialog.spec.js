import React from 'react';
import { shallow } from 'enzyme';
import ShareStackDialog from './ShareStackDialog';

describe('ShareStackDialog', () => {
  const state = {
    open: true,
    values: {},
  };
  const title = 'Example Title';
  const body = 'Warning about sharing this resource';

  it('renders to match snapshot', () => {
    expect(shallow(
      <ShareStackDialog
        onSubmit={jest.fn().mockName('onSubmit')}
        onCancel={jest.fn().mockName('onCancel')}
        state={state}
        title={title}
        body={body}
      />,
    )).toMatchSnapshot();
  });
});
