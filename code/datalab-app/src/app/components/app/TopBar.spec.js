import React from 'react';
import { createShallow } from 'material-ui/test-utils';
import TopBar from './TopBar';

describe('Topbar', () => {
  let shallow;

  beforeEach(() => {
    shallow = createShallow();
  });

  it('correctly renders correct snapshot', () => {
    expect(shallow(<TopBar identity={{ expected: 'identity', picture: 'expectedUrl' }} />)).toMatchSnapshot();
  });
});
