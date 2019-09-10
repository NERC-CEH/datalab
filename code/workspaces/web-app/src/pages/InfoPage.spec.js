import React from 'react';
import { shallow } from 'enzyme';
import InfoPage from './InfoPage';

const userPermissions = ['expectedPermission'];
const match = {
  params: {
    projectKey: 'project99',
  },
};
const props = { userPermissions, match };

it('InfoPage renders correct snapshot', () => {
  expect(shallow(<InfoPage {...props} />)).toMatchSnapshot();
});
