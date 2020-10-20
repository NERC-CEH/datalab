import React from 'react';
import { createShallow } from '@material-ui/core/test-utils';
import { SYSTEM_INSTANCE_ADMIN } from 'common/src/permissionTypes';
import TopBar from './TopBar';

describe('Topbar', () => {
  let shallow;

  beforeEach(() => {
    shallow = createShallow({ dive: true });
  });

  it('correctly renders correct snapshot', () => {
    expect(
      shallow(<TopBar identity={{ expected: 'identity', picture: 'expectedUrl' }} userPermissions = {[]} />),
    ).toMatchSnapshot();
  });

  it('correctly renders correct snapshot for instance admin', () => {
    expect(
      shallow(<TopBar identity={{ expected: 'identity', picture: 'expectedUrl' }} userPermissions = {[SYSTEM_INSTANCE_ADMIN]} />),
    ).toMatchSnapshot();
  });
});
