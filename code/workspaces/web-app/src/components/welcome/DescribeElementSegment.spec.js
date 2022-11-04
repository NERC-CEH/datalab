import React from 'react';
import { render } from '../../testUtils/renderTests';
import DescribeElementSegment from './DescribeElementSegment';

describe('DescribeElementSegment', () => {
  it('renders correct snapshot', () => {
    expect(render(<DescribeElementSegment>{<span>'expectedChild'</span>}</DescribeElementSegment>).container).toMatchSnapshot();
  });

  it('renders correct snapshot with invert switch', () => {
    expect(render(<DescribeElementSegment invert>{<span>'expectedChild'</span>}</DescribeElementSegment>).container).toMatchSnapshot();
  });
});
