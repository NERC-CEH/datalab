import React from 'react';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { makeStyles } from '@material-ui/core/styles';
// TODO - move these into common
import { ResourceAccordion, ResourceAccordionSummary, ResourceAccordionDetails } from '../../containers/adminResources/ResourceAccordion';
import AssetCard from './AssetCard';

const useStyles = makeStyles(theme => ({
  container: {
    marginBottom: theme.spacing(3),
  },
  resources: {
    marginLeft: theme.spacing(8),
  },
  heading: {
    margin: [[theme.spacing(2), 0]],
  },
}));

function AssetAccordion({ asset }) {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <ResourceAccordion defaultExpanded>
        <ResourceAccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h5" className={classes.heading}>{asset.name}: {asset.version}</Typography>
        </ResourceAccordionSummary>
        <ResourceAccordionDetails>
          <div className={classes.resources}>
            <AssetCard asset={asset} />
          </div>
        </ResourceAccordionDetails>
      </ResourceAccordion>
    </div>
  );
}

export default AssetAccordion;
