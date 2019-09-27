import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Page from './Page';
import UserPermissionsTable from '../components/settings/UserPermissionsTable';
import AddUserPermissions from '../components/settings/AddUserPermissions';

const SettingsPage = ({ userPermissions, match: { params: { projectKey } } }) => (
  <Page title="Settings">
    <Typography variant="h5">User Permissions</Typography>
    <AddUserPermissions projectKey={projectKey} />
    <UserPermissionsTable projectKey={projectKey} />
  </Page>
);

SettingsPage.propTypes = {
  userPermissions: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default SettingsPage;
