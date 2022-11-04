import React from 'react';
import { render } from '../../testUtils/renderTests';
import DescribeElementCard from './DescribeElementCard';

jest.mock('./DescribeElementCardBanner', () => props => (<div>DescribeElementCardBanner mock {JSON.stringify(props)}</div>));
jest.mock('./DescribeElementCardBody', () => props => (<div>DescribeElementCardBody mock {JSON.stringify(props)}</div>));
jest.mock('./DescribeElementCardLinks', () => props => (<div>DescribeElementCardLinks mock {JSON.stringify(props)}</div>));

describe('DescribeElementCard', () => {
  const links = [
    { displayName: 'displayName', href: 'address' },
  ];

  it('renders correct snapshot', () => {
    const props = {
      title: 'expectedTitle',
      icon: 'people',
      content: 'expectedContent',
    };

    expect(render(<DescribeElementCard {...props} />).container).toMatchSnapshot();
  });

  it('renders correct snapshot with switches', () => {
    const props = {
      title: 'expectedTitle',
      content: 'moreContent',
      links,
      invert: true,
      quote: true,
      media: true,
    };

    expect(render(<DescribeElementCard {...props} />).container).toMatchSnapshot();
  });
});
