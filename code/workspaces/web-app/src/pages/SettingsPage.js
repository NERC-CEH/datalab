import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Page from './Page';
import UserPermissionsTable from '../components/settings/UserPermissionsTable';

const SettingsPage = ({ userPermissions }) => (
  <Page title="Settings">
    <Typography variant="h5">User Permissions</Typography>
    <UserPermissionsTable />
  </Page>
);

SettingsPage.propTypes = {
  userPermissions: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default SettingsPage;
