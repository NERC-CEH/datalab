import React from 'react';
import { useDispatch } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { makeStyles } from '@material-ui/core/styles';
import { ResourceAccordion, ResourceAccordionSummary, ResourceAccordionDetails } from '../common/ResourceAccordion';
import AssetCard from './AssetCard';
import PrimaryActionButton from '../common/buttons/PrimaryActionButton';
import modalDialogActions from '../../actions/modalDialogActions';
import { MODAL_TYPE_CREATE_PROJECT } from '../../constants/modaltypes';

const useStyles = makeStyles(theme => ({
  root: {
    marginBottom: theme.spacing(3),
  },
  resources: {
    marginLeft: theme.spacing(8),
  },
  heading: {
    margin: `${theme.spacing(2)}, 0`,
  },
  buttonDiv: {
    display: 'flex',
    alignItems: 'center',
    paddingLeft: theme.spacing(8),
    paddingTop: theme.spacing(2),
  },
}));

export const openEditForm = dispatch => dispatch(
  modalDialogActions.openModalDialog(
    MODAL_TYPE_CREATE_PROJECT,
    {
      onSubmit: onEditAssetSubmit(dispatch),
      onCancel: () => dispatch(modalDialogActions.closeModalDialog()),
    },
  ),
);

export const onEditAssetSubmit = dispatch => async (asset) => {
};

function AssetAccordion({ asset }) {
  const dispatch = useDispatch();
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <ResourceAccordion defaultExpanded>
        <ResourceAccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h5" className={classes.heading}>{asset.name}: {asset.version}</Typography>
          <div className={classes.buttonDiv}>
            <PrimaryActionButton
              aria-label="edit"
              onClick={(event) => { openEditForm(dispatch); event.stopPropagation(); }}
            >
            Edit
          </PrimaryActionButton>
          </div>
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
