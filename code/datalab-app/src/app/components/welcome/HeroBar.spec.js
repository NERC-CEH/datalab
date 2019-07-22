import React from 'react';
import { createShallow } from '@material-ui/core/test-utils';
import HeroBar from './HeroBar';

describe('HeroBar', () => {
  let shallow;

  beforeEach(() => {
    shallow = createShallow({ dive: true });
  });

  it('renders correct snapshot', () => {
    expect(shallow(<HeroBar />)).toMatchSnapshot();
  });
});
