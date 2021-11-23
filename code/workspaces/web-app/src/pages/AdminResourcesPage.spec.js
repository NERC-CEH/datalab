import React from 'react';
import { render } from '@testing-library/react';
import AdminResourcesPage from './AdminResourcesPage';

const userPermissions = ['expectedPermission'];

jest.mock('../containers/adminResources/AdminResourcesContainer', () => props => (<div>AdminResourcesContainer mock {JSON.stringify(props)}</div>));
jest.mock('../components/app/Footer', () => () => (<div>Footer mock</div>));

it('AdminResourcesPage renders correct snapshot', () => {
  expect(render(<AdminResourcesPage userPermissions={userPermissions} />).container).toMatchSnapshot();
});
