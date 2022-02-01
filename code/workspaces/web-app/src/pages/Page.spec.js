import React from 'react';
import { render } from '../testUtils/renderTests';
import Page from './Page';

jest.mock('../components/app/Footer', () => () => (<div>Footer mock</div>));

describe('Page', () => {
  it('renders correctly when title is provided', () => {
    const wrapper = render(<Page title="The Page Title">Page Content</Page>);
    expect(wrapper.container).toMatchSnapshot();
  });

  it('renders correctly when title is not provided', () => {
    const wrapper = render(<Page>Page Content</Page>);
    expect(wrapper.container).toMatchSnapshot();
  });
});
