import React from 'react';
import { shallow } from 'enzyme';
import ExternalLink from './ExternalLink';

describe('ExternalLink', () => {
  it('renders to match snapshot correctly passing props to child components', () => {
    const render = shallow(<ExternalLink href="http://test-external-link.com">Test Link Text</ExternalLink>);
    expect(render).toMatchSnapshot();
  });
});
