import React from 'react';
import { shallow } from 'enzyme';
import DescribeDatalabs from './DescribeDatalabs';

it('DescribeDatalabs renders correct snapshot', () => {
  expect(shallow(<DescribeDatalabs/>)).toMatchSnapshot();
});
