import React from 'react';
import { render } from '../../testUtils/renderTests';
import DescribeElementCardLinks from './DescribeElementCardLinks';

describe('DescribeElementCardLinks', () => {
  it('renders correct snapshot', () => {
    const links = [
      { displayName: 'displayName', href: 'address' },
      { displayName: 'anotherDisplayName', href: 'anotherAddress' },
    ];

    expect(render(<DescribeElementCardLinks links={links} />).container).toMatchSnapshot();
  });
});
