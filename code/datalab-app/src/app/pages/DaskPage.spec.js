import React from 'react';
import { createShallow } from 'material-ui/test-utils';
import DaskPage from './DaskPage';

describe('DaskPage', () => {
  let shallow;

  beforeEach(() => {
    shallow = createShallow();
  });

  it('renders correct snapshot', () => {
    expect(shallow(<DaskPage />)).toMatchSnapshot();
  });
});
