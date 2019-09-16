import React from 'react';
import { shallow } from 'enzyme';
import ProjectsPage from './ProjectsPage';

it('ProjectsPage renders correct snapshot', () => {
  expect(shallow(<ProjectsPage userPermissions={['expectedPermission']} />)).toMatchSnapshot();
});
