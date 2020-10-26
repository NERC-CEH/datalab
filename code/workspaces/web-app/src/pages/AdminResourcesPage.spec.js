import React from 'react';
import { shallow } from 'enzyme';
import AdminResourcesPage from './AdminResourcesPage';

const userPermissions = ['expectedPermission'];

it('AdminResourcesPage renders correct snapshot', () => {
  expect(shallow(<AdminResourcesPage userPermissions={userPermissions} />)).toMatchSnapshot();
});
