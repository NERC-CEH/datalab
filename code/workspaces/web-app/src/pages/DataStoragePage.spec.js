import React from 'react';
import { shallow } from 'enzyme';
import DataStoragePage from './DataStoragePage';

const userPermissions = ['expectedPermission'];

it('DataStoragePage renders correct snapshot', () => {
  expect(shallow(<DataStoragePage userPermissions={userPermissions} />)).toMatchSnapshot();
});
