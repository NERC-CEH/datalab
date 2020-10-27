import React from 'react';
import Page from './Page';
import AdminResourcesContainer from '../containers/adminResources/AdminResourcesContainer';

const AdminResourcesPage = (props) => {
  const { userPermissions } = props;

  return (
  <Page title="Resources">
      <AdminResourcesContainer userPermissions={userPermissions} />
  </Page>
  );
};
export default AdminResourcesPage;
