import React from 'react';
import { createShallow } from '@material-ui/core/test-utils';
import DescribeElementCard from './DescribeElementCard';

function shallowRender(props) {
  const shallow = createShallow({ dive: true });

  return shallow(<DescribeElementCard {...props} />);
}

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

    expect(shallowRender(props)).toMatchSnapshot();
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

    expect(shallowRender(props)).toMatchSnapshot();
  });
});
