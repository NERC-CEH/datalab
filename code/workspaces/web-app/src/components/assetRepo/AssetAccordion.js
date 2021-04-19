import React from 'react';
import { useDispatch } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { makeStyles } from '@material-ui/core/styles';
import { reset } from 'redux-form';
import { ResourceAccordion, ResourceAccordionSummary, ResourceAccordionDetails } from '../common/ResourceAccordion';
import AssetCard from './AssetCard';
import PrimaryActionButton from '../common/buttons/PrimaryActionButton';
import modalDialogActions from '../../actions/modalDialogActions';
import { MODAL_TYPE_EDIT_ASSET } from '../../constants/modaltypes';
import EditRepoMetadataForm, { FORM_NAME } from './EditRepoMetadataForm';
import assetRepoActions from '../../actions/assetRepoActions';
import notify from '../common/notify';

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

export const openEditForm = (dispatch, asset) => dispatch(
  modalDialogActions.openModalDialog(
    MODAL_TYPE_EDIT_ASSET,
    {
      onSubmit: onEditAssetSubmit(dispatch),
      onCancel: () => dispatch(modalDialogActions.closeModalDialog()),
      asset,
      formComponent: EditRepoMetadataForm,
    },
  ),
);

export const onEditAssetSubmit = dispatch => async (asset) => {
  dispatch(modalDialogActions.closeModalDialog());
  try {
    await dispatch(assetRepoActions.updateRepoMetadata(asset));
    await reset(FORM_NAME);
    notify.success('Asset updated');
  } catch (error) {
    notify.error('Unable to update asset');
  } finally {
    await dispatch(assetRepoActions.loadProjects());
  }
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
              onClick={(event) => { openEditForm(dispatch, asset); event.stopPropagation(); }}
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
