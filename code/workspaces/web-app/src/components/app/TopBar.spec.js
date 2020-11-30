import React from 'react';
import { createShallow } from '@material-ui/core/test-utils';
import { SYSTEM_INSTANCE_ADMIN } from 'common/src/permissionTypes';
import TopBar from './TopBar';
import { useCurrentUserPermissions } from '../../hooks/authHooks';

jest.mock('../../hooks/authHooks');

describe('Topbar', () => {
  let shallow;

  beforeEach(() => {
    shallow = createShallow({ dive: true });
  });

  it('correctly renders correct snapshot', () => {
    useCurrentUserPermissions.mockReturnValueOnce({ value: [] });
    expect(
      shallow(<TopBar identity={{ expected: 'identity', picture: 'expectedUrl' }} />),
    ).toMatchSnapshot();
  });

  it('correctly renders correct snapshot for instance admin', () => {
    useCurrentUserPermissions.mockReturnValueOnce({ value: [SYSTEM_INSTANCE_ADMIN] });
    expect(
      shallow(<TopBar identity={{ expected: 'identity', picture: 'expectedUrl' }} userPermissions = {[SYSTEM_INSTANCE_ADMIN]} />),
    ).toMatchSnapshot();
  });
});
