import React from 'react';
import { render } from '../../testUtils/renderTests';
import { PureEditDataStoreForm } from './editDataStoreForm';

jest.mock('redux-form', () => ({
  ...jest.requireActual('redux-form'),
  Field: props => (<div>Field mock {JSON.stringify(props)}</div>),
}));

describe('EditDataStoreForm', () => {
  const shallowRender = () => render(
    <PureEditDataStoreForm
      handleSubmit={jest.fn().mockName('handleSubmit')}
      reset={jest.fn().mockName('reset')}
      pristine={true}
      onCancel={jest.fn().mockName('onCancel')}
      userList={[{ label: 'User 1', value: 'user1' }, { label: 'User 2', value: 'user2' }]}
      loadUsersPromise={{ error: null, fetching: false, value: [] }}
    />,
  ).container;

  it('renders to match snapshot', () => {
    expect(shallowRender()).toMatchSnapshot();
  });
});
