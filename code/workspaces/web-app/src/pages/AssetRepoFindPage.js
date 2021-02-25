import React from 'react';
import Page from './Page';
import AssetRepoFindContainer from '../containers/assetRepo/AssetRepoFindContainer';

const AssetRepoAddMetadataPage = (props) => {
  const { userPermissions } = props;
  return (
  <Page title="Find Asset">
    <AssetRepoFindContainer userPermissions={userPermissions}/>
  </Page>
  );
};
export default AssetRepoAddMetadataPage;
