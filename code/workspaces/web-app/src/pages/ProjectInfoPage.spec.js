import React from 'react';
import { shallow } from 'enzyme';
import ProjectInfoPage from './ProjectInfoPage';

const userPermissions = ['expectedPermission'];
const match = {
  params: {
    projectKey: 'project99',
  },
};
const props = { userPermissions, match };

it('ProjectInfoPage renders correct snapshot', () => {
  expect(shallow(<ProjectInfoPage {...props} />)).toMatchSnapshot();
});
