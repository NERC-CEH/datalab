import React from 'react';
import { shallow } from 'enzyme';
import AboutPage from './AboutPage';

it('WelcomePage renders correct snapshot', () => {
  expect(shallow(<AboutPage/>)).toMatchSnapshot();
});
