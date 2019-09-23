import React from 'react';
import { shallow } from 'enzyme';
import DataStoragePage from './DataStoragePage';

const userPermissions = ['expectedPermission'];
const match = {
  params: {
    projectKey: 'project99',
  },
};
const props = { userPermissions, match };

it('DataStoragePage renders correct snapshot', () => {
  expect(shallow(<DataStoragePage {...props} />)).toMatchSnapshot();
});
