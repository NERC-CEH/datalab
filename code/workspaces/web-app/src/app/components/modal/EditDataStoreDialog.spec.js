import React from 'react';
import { shallow } from 'enzyme';
import EditDataStoreDialog from './EditDataStoreDialog';

describe('Edit data store dialog', () => {
  function shallowRender(props) {
    return shallow(<EditDataStoreDialog {...props} />);
  }

  it('creates correct snapshot', () => {
    // Arrange / Act
    const output = shallowRender({
      onCancel: () => {},
      title: 'expectedTitle',
      currentUsers: [{ label: 'expectedLabelOne', value: 'expectedValueOne' }],
      userList: [{ label: 'expectedLabelTwo', value: 'expectedValueTwo' }],
      addUser: () => {},
      removeUser: () => {},
      loadUsersPromise: {
        error: null,
        fetching: false,
        value: [],
      },
    });

    // Assert
    expect(output).toMatchSnapshot();
  });
});
