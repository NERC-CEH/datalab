import React from 'react';
import { shallow } from 'enzyme';
import { PureEditDataStoreForm } from './editDataStoreForm';

describe('EditDataStoreForm', () => {
  const shallowRender = () => shallow(
    <PureEditDataStoreForm
      handleSubmit={jest.fn().mockName('handleSubmit')}
      reset={jest.fn().mockName('reset')}
      pristine={true}
      onCancel={jest.fn().mockName('onCancel')}
      userList={[{ label: 'User 1', value: 'user1' }, { label: 'User 2', value: 'user2' }]}
      loadUsersPromise={{ error: null, fetching: false, value: [] }}
    />,
  );

  it('renders to match snapshot', () => {
    expect(shallowRender()).toMatchSnapshot();
  });
});
