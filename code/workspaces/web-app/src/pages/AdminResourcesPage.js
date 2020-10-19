import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Page from './Page';
import AdminResourcesContainer from '../containers/adminResources/AdminResourcesContainer';

const useStyles = makeStyles(() => ({
  resourcesPage: {
    maxWidth: 600,
  },
}));

const AdminResourcesPage = (props) => {
  const { userPermissions } = props;
  const classes = useStyles();

  return (
  <Page className={classes.resourcesPage} title="Resources">
      <AdminResourcesContainer userPermissions={userPermissions} />
  </Page>
  );
};
export default AdminResourcesPage;
