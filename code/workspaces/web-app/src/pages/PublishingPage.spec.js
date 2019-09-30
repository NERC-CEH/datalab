import React from 'react';
import { shallow } from 'enzyme';
import PublishingPage from './PublishingPage';

const match = { params: { projectKey: 'project' } };

it('PublishingPage renders correct snapshot', () => {
  expect(shallow(<PublishingPage userPermissions={['expectedPermission']} match={match} />)).toMatchSnapshot();
});
