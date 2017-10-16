import React from 'react';
import { shallow } from 'enzyme';
import DescribeElementCardLinks from './DescribeElementCardLinks';

describe('DescribeElementCardLinks', () => {
  it('renders correct snapshot', () => {
    const links = [
      { displayName: 'displayName', href: 'address' },
      { displayName: 'anotherDisplayName', href: 'anotherAddress' },
    ];

    expect(shallow(<DescribeElementCardLinks links={links} />)).toMatchSnapshot();
  });
});
