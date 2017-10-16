import React from 'react';
import { createShallow } from 'material-ui/test-utils';
import DescribeElementSegment from './DescribeElementSegment';

describe('DescribeElementSegment', () => {
  let shallow;

  beforeEach(() => {
    shallow = createShallow({ dive: true });
  });

  it('renders correct snapshot', () => {
    expect(shallow(<DescribeElementSegment>{<span>'expectedChild'</span>}</DescribeElementSegment>)).toMatchSnapshot();
  });

  it('renders correct snapshot with invert switch', () => {
    expect(shallow(<DescribeElementSegment invert>{<span>'expectedChild'</span>}</DescribeElementSegment>)).toMatchSnapshot();
  });
});
