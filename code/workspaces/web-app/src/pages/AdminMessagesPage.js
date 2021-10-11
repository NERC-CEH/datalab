import React from 'react';
import Page from './Page';
import AdminMessagesContainer from '../containers/adminMessages/AdminMessagesContainer';

const AdminMessagesPage = (props) => {
  const { userPermissions } = props;

  return (
  <Page title="Messages">
      <AdminMessagesContainer userPermissions={userPermissions} />
  </Page>
  );
};
export default AdminMessagesPage;
