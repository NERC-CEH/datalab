import React from 'react';
import { createShallow } from 'material-ui/test-utils';
import Navigation from './Navigation';

describe('DescribeDatalabs', () => {
  let shallow;

  beforeEach(() => {
    shallow = createShallow({ dive: true });
  });

  it('renders correct snapshot', () => {
    expect(shallow(
      <Navigation identity={{ expected: 'identity' }}>
        <span>Content</span>
      </Navigation>)).toMatchSnapshot();
  });
});
