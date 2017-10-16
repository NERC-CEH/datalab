import React from 'react';
import { createShallow } from 'material-ui/test-utils';
import DescribeElementCardBody from './DescribeElementCardBody';

function shallowRender(props) {
  const shallow = createShallow({ dive: true });

  return shallow(<DescribeElementCardBody {...props} />);
}

describe('DescribeElementCardBody', () => {
  it('renders correct snapshot', () => {
    const props = {
      content: 'expectedContent',
    };

    expect(shallowRender(props)).toMatchSnapshot();
  });

  it('renders correct snapshot with switches', () => {
    const props = {
      content: 'moreContent',
      quote: true,
      media: true,
    };

    expect(shallowRender(props)).toMatchSnapshot();
  });
});
