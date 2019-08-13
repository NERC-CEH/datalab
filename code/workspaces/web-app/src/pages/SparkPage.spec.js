import React from 'react';
import { createShallow } from '@material-ui/core/test-utils';
import SparkPage from './SparkPage';

describe('SparkPage', () => {
  let shallow;

  beforeEach(() => {
    shallow = createShallow();
  });

  it('renders correct snapshot', () => {
    expect(shallow(<SparkPage />)).toMatchSnapshot();
  });
});
