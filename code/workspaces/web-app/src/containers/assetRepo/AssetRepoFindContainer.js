import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import sortByName from '../../components/common/sortByName';
import PromisedContentWrapper from '../../components/common/PromisedContentWrapper';
import Pagination from '../../components/stacks/Pagination';
import AssetMultiSelect from '../../components/common/form/AssetMultiSelect';
import assetRepoActions from '../../actions/assetRepoActions';
import { useAssetRepo } from '../../hooks/assetRepoHooks';
import AssetAccordion from '../../components/assetRepo/AssetAccordion';

const useStyles = makeStyles(theme => ({
  showControls: {
    display: 'flex',
    alignItems: 'center',
  },
  showText: {
    fontWeight: '400',
    marginRight: theme.spacing(4),
  },
  placeholderCard: {
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
  const shownAssets = (selectedAssets && selectedAssets.length > 0) ? selectedAssets : sortByName(assetRepo.value.assets);

  useEffect(() => {
    dispatch(assetRepoActions.loadAllAssets());
  }, [dispatch]);

  const renderedAssets = shownAssets && shownAssets.length > 0
    ? shownAssets.map(asset => <AssetAccordion key={asset.assetId} asset={asset}/>)
    : [<div className={classes.placeholderCard} key={'placeholder-card'}>
      <Typography variant="body1">No assets to display.</Typography>
    </div>];

  const assetsInput = {
    onChange: (val) => { setSelectedAssets(val); },
    value: selectedAssets,
  };

  return (
    <>
      <AssetMultiSelect input={assetsInput} showAllAssets />
      <PromisedContentWrapper fetchingClassName={classes.placeholderCard} promise={assetRepo}>
        <Pagination items={renderedAssets} itemsPerPage={5} />
      </PromisedContentWrapper>
    </>
  );
}

export default AssetRepoFindContainer;
