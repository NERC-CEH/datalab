import React from 'react';
import { shallow } from 'enzyme';
import WelcomePage from './WelcomePage';

it('WelcomePage renders correct snapshot', () => {
  expect(shallow(<WelcomePage/>)).toMatchSnapshot();
});
