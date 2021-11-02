import React from 'react';
import Page from './Page';
import { AddAssetsToNotebookContainer } from '../containers/assetRepo/AddAssetsToNotebookContainer';

const AddAssetsToNotebookPage = (props) => {
  const { userPermissions } = props;
  return (
  <Page title="Add Assets to Notebook">
    <AddAssetsToNotebookContainer userPermissions={userPermissions}/>
  </Page>
  );
};
export default AddAssetsToNotebookPage;
