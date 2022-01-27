import React from 'react';
import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles(theme => ({
  row: {
    display: 'flex',
  },
  key: {
    fontWeight: 'lighter',
    width: theme.spacing(20),
    marginBottom: theme.spacing(1),
  },
  value: {
    marginBottom: theme.spacing(1),
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
  },
}));

function AssetCardKeyValue({ rowKey, rowValue }) {
  const classes = useStyles();
  return (
    <div className={classes.row}>
      <div className={classes.key}>{rowKey}</div>
      <div className={classes.value}>{rowValue}</div>
    </div>
  );
}

function AssetCardHyperlink({ rowKey, rowValue }) {
  const classes = useStyles();
  return (
    <div className={classes.row}>
      <div className={classes.key}>{rowKey}</div>
      <div className={classes.value}><a href={rowValue} target="_blank" rel="noopener noreferrer">{rowValue}</a></div>
    </div>
  );
}

function AssetCardKeyList({ rowKey, rowList }) {
  const classes = useStyles();
  return (
    <div className={classes.row}>
      <div className={classes.key}>{rowKey}</div>
      <div className={classes.list}>
        {rowList && rowList.map(value => (<div key={value} className={classes.value}>{value}</div>))}
      </div>
    </div>
  );
}

function AssetCard({ asset }) {
  const visibility = {
    PUBLIC: 'Public',
    BY_PROJECT: 'By project',
  };
  return (
    <>
      <AssetCardKeyValue rowKey="Name" rowValue={asset.name} />
      <AssetCardKeyValue rowKey="Version" rowValue={asset.version} />
      <AssetCardKeyValue rowKey="Asset Id" rowValue={asset.assetId} />
      <AssetCardKeyValue rowKey="File location" rowValue={asset.fileLocation} />
      <AssetCardHyperlink rowKey="Master URL" rowValue={asset.masterUrl} />
      <AssetCardKeyList rowKey="Owners" rowList={asset.owners ? asset.owners.map(owner => owner.name) : []} />
      <AssetCardKeyValue rowKey="Visibility" rowValue={visibility[asset.visible]} />
      <AssetCardKeyList rowKey="Projects" rowList={asset.projects ? asset.projects.map(project => project.name) : []} />
    </>
  );
}

export default AssetCard;
