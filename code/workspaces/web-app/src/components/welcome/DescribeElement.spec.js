import React from 'react';
import { render } from '@testing-library/react';
import DescribeElement from './DescribeElement';

jest.mock('./DescribeElementCard', () => props => (<div>DescribeElementCard mock {JSON.stringify(props)}</div>));

describe('DescribeElement', () => {
  const links = [
    { displayName: 'displayName', href: 'address' },
  ];

  const content = [
    { icon: 'people', title: 'expectedTitle', content: 'expectedContent' },
    { title: 'anotherTitle', content: 'moreContent', links },
  ];

  it('renders correct snapshot', () => {
    const props = {
      title: 'cardTitle',
      descriptions: content,
    };

    expect(render(<DescribeElement {...props} />).container).toMatchSnapshot();
  });

  it('renders correct snapshot with switches', () => {
    const props = {
      title: 'cardTitle',
      descriptions: content,
      invert: true,
      quote: true,
      media: true,
    };

    expect(render(<DescribeElement {...props} />).container).toMatchSnapshot();
  });
});
