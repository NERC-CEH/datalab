import React from 'react';
import Page from './Page';
import AdminUsersContainer from '../containers/adminResources/AdminUsersContainer';

const AdminUsersPage = (props) => {
  const { userPermissions } = props;

  return (
    <Page title="Users">
      <AdminUsersContainer userPermissions={userPermissions} />
    </Page>
  );
};
export default AdminUsersPage;
