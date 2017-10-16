import React from 'react';
import { createShallow } from 'material-ui/test-utils';
import Footer from './Footer';

describe('Footer', () => {
  let shallow;

  beforeEach(() => {
    shallow = createShallow({ dive: true });
  });

  it('renders correct snapshot', () => {
    expect(shallow(<Footer />)).toMatchSnapshot();
  });
});
