import React from 'react';
import { shallow } from 'enzyme';
import PublishingPage from './PublishingPage';

it('PublishingPage renders correct snapshot', () => {
  expect(shallow(<PublishingPage userPermissions={['expectedPermission']} />)).toMatchSnapshot();
});
