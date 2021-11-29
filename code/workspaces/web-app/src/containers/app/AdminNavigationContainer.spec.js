import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { permissionTypes } from 'common';
import AdminNavigationContainer from './AdminNavigationContainer';
import { useCurrentUserPermissions } from '../../hooks/authHooks';

jest.mock('../../pages/AdminResourcesPage', () => () => (<>AdminResourcesPage Mock</>));
jest.mock('../../pages/AdminUsersPage', () => () => (<>AdminUsersPage Mock</>));
jest.mock('../../pages/AdminMessagesPage', () => () => (<>AdminMessagesPage Mock</>));

jest.mock('../../components/app/Footer', () => () => (<div>Footer mock</div>));

jest.mock('../../hooks/authHooks');

describe('AdminNavigationContainer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useCurrentUserPermissions.mockReturnValue({ value: [permissionTypes.SYSTEM_INSTANCE_ADMIN] });
  });

  const renderWithHistory = path => render(
    <MemoryRouter initialEntries={[path]} >
      <AdminNavigationContainer />
    </MemoryRouter>,
  );

  it('renders to match snapshot passing correct props to children', () => {
    const wrapper = renderWithHistory('/foo/bar');
    expect(wrapper.container).toMatchSnapshot();

    expect(wrapper.queryByText('404 – Page Not Found')).not.toBeNull();
  });

  it('renders correctly for the admin resources route', () => {
    const wrapper = renderWithHistory('/admin/resources');

    expect(wrapper.queryByText('AdminResourcesPage Mock')).not.toBeNull();
    expect(wrapper.queryByText('AdminUsersPage Mock')).toBeNull();
    expect(wrapper.queryByText('AdminMessagesPage Mock')).toBeNull();
  });

  it('renders correctly for the admin users route', () => {
    const wrapper = renderWithHistory('/admin/users');

    expect(wrapper.queryByText('AdminResourcesPage Mock')).toBeNull();
    expect(wrapper.queryByText('AdminUsersPage Mock')).not.toBeNull();
    expect(wrapper.queryByText('AdminMessagesPage Mock')).toBeNull();
  });

  it('renders correctly for the admin messages route', () => {
    const wrapper = renderWithHistory('/admin/messages');

    expect(wrapper.queryByText('AdminResourcesPage Mock')).toBeNull();
    expect(wrapper.queryByText('AdminUsersPage Mock')).toBeNull();
    expect(wrapper.queryByText('AdminMessagesPage Mock')).not.toBeNull();
  });
});
