import React from 'react';
import { render } from '../../testUtils/renderTests';
import DescribeElementCardBody from './DescribeElementCardBody';

describe('DescribeElementCardBody', () => {
  it('renders correct snapshot', () => {
    const props = {
      content: 'expectedContent',
    };

    expect(render(<DescribeElementCardBody {...props} />).container).toMatchSnapshot();
  });

  it('renders correct snapshot with switches', () => {
    const props = {
      content: 'moreContent',
      quote: true,
      media: true,
    };

    expect(render(<DescribeElementCardBody {...props} />).container).toMatchSnapshot();
  });
});
