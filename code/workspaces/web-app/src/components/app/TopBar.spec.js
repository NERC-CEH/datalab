import React from 'react';
import { createShallow } from '@material-ui/core/test-utils';
import { permissionTypes } from 'common';
import TopBar from './TopBar';
import { useCurrentUserPermissions } from '../../hooks/authHooks';
import { getCatalogue } from '../../config/catalogue';

const { SYSTEM_INSTANCE_ADMIN, SYSTEM_DATA_MANAGER } = permissionTypes;

jest.mock('../../hooks/authHooks');
jest.mock('../../config/catalogue');
getCatalogue.mockReturnValue({ available: false });

describe('TopBar', () => {
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

  it('correctly renders correct snapshot for instance admin permission', () => {
    useCurrentUserPermissions.mockReturnValueOnce({ value: [SYSTEM_INSTANCE_ADMIN] });
    expect(
      shallow(<TopBar identity={{ expected: 'identity', picture: 'expectedUrl' }} userPermissions = {[SYSTEM_INSTANCE_ADMIN]} />),
    ).toMatchSnapshot();
  });

  it('correctly renders correct snapshot for data manager permission', () => {
    useCurrentUserPermissions.mockReturnValueOnce({ value: [SYSTEM_DATA_MANAGER] });
    expect(
      shallow(<TopBar identity={{ expected: 'identity', picture: 'expectedUrl' }} userPermissions = {[SYSTEM_DATA_MANAGER]} />),
    ).toMatchSnapshot();
  });

  it('correctly renders correct snapshot if catalogue exists', () => {
    useCurrentUserPermissions.mockReturnValueOnce({ value: [] });
    getCatalogue.mockReturnValueOnce({ available: true, topBarLink: true, url: 'https://catalogue-url.com/' });
    expect(
      shallow(<TopBar identity={{ expected: 'identity', picture: 'expectedUrl' }} />),
    ).toMatchSnapshot();
  });
});
