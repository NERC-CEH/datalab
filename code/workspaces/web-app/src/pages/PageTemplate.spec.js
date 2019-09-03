import React from 'react';
import { createShallow } from '@material-ui/core/test-utils';
import PageTemplate from './PageTemplate';

describe('PageTemplate', () => {
  let shallow;

  beforeEach(() => {
    shallow = createShallow({ dive: true });
  });

  it('renders correctly when title is provided', () => {
    expect(
      shallow(<PageTemplate title="The Page Title">Page Content</PageTemplate>),
    ).toMatchSnapshot();
  });

  it('renders correctly when title is not provided', () => {
    expect(
      shallow(<PageTemplate>Page Content</PageTemplate>),
    ).toMatchSnapshot();
  });
});
