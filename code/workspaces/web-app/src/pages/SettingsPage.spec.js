import React from 'react';
import { render } from '@testing-library/react';
import SettingsPage from './SettingsPage';

jest.mock('../components/settings/UserPermissionsTable', () => () => (<div>UserPermissionsTable mock</div>));
jest.mock('../components/settings/AddUserPermissions', () => () => (<div>AddUserPermissions mock</div>));
jest.mock('../components/settings/EditProjectDetails', () => () => (<div>EditProjectDetails mock</div>));
jest.mock('./Page', () => props => (<div>Page mock {`title: ${props.title}`} {props.children}</div>));

const userPermissions = ['project:settings:list'];

describe('SettingsPage', () => {
  it('renders to match snapshot', () => {
    expect(
      render(<SettingsPage userPermissions={userPermissions} />).container,
    ).toMatchSnapshot();
  });
});
