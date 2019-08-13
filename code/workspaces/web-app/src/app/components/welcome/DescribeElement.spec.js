import React from 'react';
import { createShallow } from '@material-ui/core/test-utils';
import DescribeElement from './DescribeElement';

function shallowRender(props) {
  const shallow = createShallow({ dive: true });

  return shallow(<DescribeElement {...props} />);
}

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

    expect(shallowRender(props)).toMatchSnapshot();
  });

  it('renders correct snapshot with switches', () => {
    const props = {
      title: 'cardTitle',
      descriptions: content,
      invert: true,
      quote: true,
      media: true,
    };

    expect(shallowRender(props)).toMatchSnapshot();
  });
});
