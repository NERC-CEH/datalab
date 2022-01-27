import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import Page from './Page';
import UserPermissionsTable from '../components/settings/UserPermissionsTable';
import AddUserPermissions from '../components/settings/AddUserPermissions';
import EditProjectDetails from '../components/settings/EditProjectDetails';

const SettingsPage = ({ userPermissions }) => (
  <Page title="Settings">
    <Typography variant="h5">Project Details</Typography>
    <EditProjectDetails/>
    <Typography variant="h5">User Permissions</Typography>
    <AddUserPermissions />
    <UserPermissionsTable />
  </Page>
);

SettingsPage.propTypes = {
  userPermissions: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default SettingsPage;
