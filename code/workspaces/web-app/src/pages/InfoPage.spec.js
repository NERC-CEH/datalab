import React from 'react';
import { shallow } from 'enzyme';
import InfoPage from './InfoPage';

it('InfoPage renders correct snapshot', () => {
  expect(shallow(<InfoPage userPermissions={['expectedPermission']} />)).toMatchSnapshot();
});
