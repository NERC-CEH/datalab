import React from 'react';
import { render } from '../../testUtils/renderTests';
import DescribeElementCardBanner from './DescribeElementCardBanner';

describe('DescribeElementCardBanner', () => {
  it('renders correct snapshot', () => {
    const props = {
      title: 'expectedTitle',
      icon: 'people',
    };

    expect(render(<DescribeElementCardBanner {...props} />).container).toMatchSnapshot();
  });

  it('renders correct snapshot with switches', () => {
    const props = {
      title: 'expectedTitle',
    };

    expect(render(<DescribeElementCardBanner {...props} />).container).toMatchSnapshot();
  });
});
