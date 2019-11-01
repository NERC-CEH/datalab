import React from 'react';
import { createShallow } from '@material-ui/core/test-utils';
import DescribeElementCardBanner from './DescribeElementCardBanner';

function shallowRender(props) {
  const shallow = createShallow({ dive: true });

  return shallow(<DescribeElementCardBanner {...props} />);
}

describe('DescribeElementCardBanner', () => {
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
    };

    expect(shallowRender(props)).toMatchSnapshot();
  });
});
