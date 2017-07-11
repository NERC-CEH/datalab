import React from 'react';
import { shallow } from 'enzyme';
import Navigation from './Navigation';

it('DescribeDatalabs renders correct snapshot', () => {
  expect(shallow(<Navigation/>)).toMatchSnapshot();
});
