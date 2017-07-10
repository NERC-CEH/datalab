import React from 'react';
import { shallow } from 'enzyme';
import HeroBar from './HeroBar';

it('HeroBar renders correct snapshot', () => {
  expect(shallow(<HeroBar/>)).toMatchSnapshot();
});
