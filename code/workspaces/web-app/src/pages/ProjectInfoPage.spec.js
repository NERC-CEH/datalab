import React from 'react';
import { shallow } from 'enzyme';
import ProjectInfoPage from './ProjectInfoPage';

const userPermissions = ['expectedPermission'];

it('ProjectInfoPage renders correct snapshot', () => {
  expect(shallow(<ProjectInfoPage userPermissions={userPermissions} />)).toMatchSnapshot();
});
