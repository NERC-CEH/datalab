import React from 'react';
import { shallow } from 'enzyme';
import { PureEditDataStoreForm } from './editDataStoreForm';

describe('CreateProjectForm', () => {
  const shallowRender = pristine => shallow(
    <PureEditDataStoreForm
      handleSubmit={jest.fn().mockName('handleSubmit')}
      reset={jest.fn().mockName('reset')}
      pristine={pristine}
      onCancel={jest.fn().mockName('onCancel')}
      userList={[{ label: 'User 1', value: 'user1' }, { label: 'User 2', value: 'user2' }]}
      loadUsersPromise={{ error: null, fetching: false, value: [] }}
    />,
  );

  it('renders to match snapshot when form pristine', () => {
    const pristine = true;
    expect(shallowRender(pristine)).toMatchSnapshot();
  });

  it('renders to match snapshot when form is not pristine', () => {
    const pristine = false;
    expect(shallowRender(pristine)).toMatchSnapshot();
  });
});
