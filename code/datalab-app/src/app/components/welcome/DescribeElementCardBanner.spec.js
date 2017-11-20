import React from 'react';
import { createShallow } from 'material-ui/test-utils';
import DescribeElementCardBanner from './DescribeElementCardBanner';

function shallowRender(props) {
  const shallow = createShallow({ dive: true });

  return shallow(<DescribeElementCardBanner {...props} />);
}

describe('DescribeElementCardBanner', () => {
  const links = [
    { displayName: 'displayName', href: 'address' },
  ];

  it('renders correct snapshot', () => {
    const props = {
      title: 'expectedTitle',
      icon: 'people',
    };

    expect(shallowRender(props)).toMatchSnapshot();
  });

  it('renders correct snapshot with switches', () => {
    const props = {
      title: 'expectedTitle',
      doubleHeight: true,
    };

    expect(shallowRender(props)).toMatchSnapshot();
  });
});
