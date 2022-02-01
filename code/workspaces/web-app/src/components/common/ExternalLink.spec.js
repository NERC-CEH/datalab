import React from 'react';
import { render } from '../../testUtils/renderTests';
import ExternalLink from './ExternalLink';

describe('ExternalLink', () => {
  it('renders to match snapshot correctly passing props to child components', () => {
    const wrapper = render(<ExternalLink href="http://test-external-link.com">Test Link Text</ExternalLink>).container;
    expect(wrapper).toMatchSnapshot();
  });
});
