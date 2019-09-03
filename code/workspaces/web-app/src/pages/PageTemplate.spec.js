import React from 'react';
import { createShallow } from '@material-ui/core/test-utils';
import Page from './Page';

describe('Page', () => {
  let shallow;

  beforeEach(() => {
    shallow = createShallow({ dive: true });
  });

  it('renders correctly when title is provided', () => {
    expect(
      shallow(<Page title="The Page Title">Page Content</Page>),
    ).toMatchSnapshot();
  });

  it('renders correctly when title is not provided', () => {
    expect(
      shallow(<Page>Page Content</Page>),
    ).toMatchSnapshot();
  });
});
