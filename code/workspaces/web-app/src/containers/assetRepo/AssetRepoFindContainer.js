import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import makeStyles from '@mui/styles/makeStyles';
import Typography from '@mui/material/Typography';
import sortByName from '../../components/common/sortByName';
import PromisedContentWrapper from '../../components/common/PromisedContentWrapper';
import Pagination from '../../components/stacks/Pagination';
import AssetMultiSelect from '../../components/common/form/AssetMultiSelect';
import assetRepoActions from '../../actions/assetRepoActions';
import projectsActions from '../../actions/projectActions';
import userActions from '../../actions/userActions';
import { useAssetRepo } from '../../hooks/assetRepoHooks';
import AssetAccordion from '../../components/assetRepo/AssetAccordion';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    height: 70,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderTop: `1px solid ${theme.palette.divider}`,
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
}));

function AssetRepoFindContainer({ userPermissions }) {
  const dispatch = useDispatch();
  const [selectedAssets, setSelectedAssets] = useState([]);
  const classes = useStyles();
  const assetRepo = useAssetRepo();

  // @ts-ignore - no way to let tsc know the shape of selectedAssets
  const selectedAssetIds = selectedAssets ? selectedAssets.map(asset => asset.assetId) : [];

  // recalculate shownAssets in case edited
  const shownAssets = (selectedAssetIds.length > 0)
    ? sortByName(assetRepo.value.assets.filter(asset => selectedAssetIds.includes(asset.assetId)))
    : sortByName(assetRepo.value.assets);

  useEffect(() => {
    dispatch(assetRepoActions.loadAssetsForUser());
    dispatch(projectsActions.loadProjects()); // needed for Asset Edit
    dispatch(userActions.listUsers()); // needed for Asset Edit
  }, [dispatch]);

  const renderedAssets = shownAssets && shownAssets.length > 0
    ? shownAssets.map(asset => <AssetAccordion key={asset.assetId} asset={asset}/>)
    : [<div className={classes.root} key={'placeholder-card'}>
      <Typography variant="body1">No assets to display.</Typography>
    </div>];

  const assetsInput = {
    onChange: (val) => { setSelectedAssets(val); },
    value: selectedAssets,
  };

  return (
    <>
      <AssetMultiSelect input={assetsInput} showAllAssets />
      <PromisedContentWrapper fetchingClassName={classes.root} promise={assetRepo}>
        <Pagination items={renderedAssets} itemsPerPage={5} />
      </PromisedContentWrapper>
    </>
  );
}

export default AssetRepoFindContainer;
