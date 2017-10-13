import React from 'react';
import { createShallow } from 'material-ui/test-utils';
import DescribeDatalabs from './DescribeDatalabs';

describe('DescribeDatalabs', () => {
  let shallow;

  beforeEach(() => {
    shallow = createShallow();
  });

  it('renders correct snapshot', () => {
    expect(shallow(<DescribeDatalabs/>)).toMatchSnapshot();
  });
});
