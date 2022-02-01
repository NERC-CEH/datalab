import React from 'react';
import { permissionTypes } from 'common';
import { render } from '../../testUtils/renderTests';
import TopBar from './TopBar';
import { useCurrentUserPermissions } from '../../hooks/authHooks';
import { getCatalogue } from '../../config/catalogue';

const { SYSTEM_INSTANCE_ADMIN, SYSTEM_DATA_MANAGER } = permissionTypes;

jest.mock('../../hooks/authHooks');
jest.mock('../../config/catalogue');
jest.mock('./TopBarButton', () => props => (<div>TopBarButton mock {JSON.stringify(props)}</div>));
jest.mock('./UserIcon', () => props => (<div>UserIcon mock {JSON.stringify(props)}</div>));

beforeEach(() => {
  getCatalogue.mockReturnValue({ available: false });
});

describe('TopBar', () => {
  it('correctly renders correct snapshot', () => {
    useCurrentUserPermissions.mockReturnValueOnce({ value: [] });
    const wrapper = render(<TopBar identity={{ expected: 'identity', picture: 'expectedUrl' }} />);
    expect(wrapper.container).toMatchSnapshot();
  });

  it('correctly renders correct snapshot for instance admin permission', () => {
    useCurrentUserPermissions.mockReturnValueOnce({ value: [SYSTEM_INSTANCE_ADMIN] });
    const wrapper = render(<TopBar identity={{ expected: 'identity', picture: 'expectedUrl' }} userPermissions={[SYSTEM_INSTANCE_ADMIN]} />);
    expect(wrapper.container).toMatchSnapshot();
  });

  it('correctly renders correct snapshot for data manager permission', () => {
    useCurrentUserPermissions.mockReturnValueOnce({ value: [SYSTEM_DATA_MANAGER] });
    const wrapper = render(<TopBar identity={{ expected: 'identity', picture: 'expectedUrl' }} userPermissions = {[SYSTEM_DATA_MANAGER]} />);
    expect(wrapper.container).toMatchSnapshot();
  });

  it('correctly renders correct snapshot if catalogue exists', () => {
    useCurrentUserPermissions.mockReturnValueOnce({ value: [] });
    getCatalogue.mockReturnValueOnce({ available: true, url: 'https://catalogue-url.com/' });
    const wrapper = render(<TopBar identity={{ expected: 'identity', picture: 'expectedUrl' }} />);
    expect(wrapper.container).toMatchSnapshot();
  });
});
