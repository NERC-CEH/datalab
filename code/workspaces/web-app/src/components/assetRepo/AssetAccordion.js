import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Icon from '@mui/material/Icon';
import makeStyles from '@mui/styles/makeStyles';
import { reset } from 'redux-form';
import { permissionTypes } from 'common';
import { ResourceAccordion, ResourceAccordionSummary, ResourceAccordionDetails } from '../common/ResourceAccordion';
import AssetCard from './AssetCard';
import PrimaryActionButton from '../common/buttons/PrimaryActionButton';
import SecondaryActionButton from '../common/buttons/SecondaryActionButton';
import modalDialogActions from '../../actions/modalDialogActions';
import { MODAL_TYPE_EDIT_ASSET, MODAL_TYPE_CONFIRMATION } from '../../constants/modaltypes';
import EditRepoMetadataForm, { FORM_NAME, OWNERS_FIELD_NAME, VISIBLE_FIELD_NAME } from './EditRepoMetadataForm';
import assetRepoActions from '../../actions/assetRepoActions';
import notify from '../common/notify';
import assetLabel from '../common/form/assetLabel';
import { BY_PROJECT } from './assetVisibilities';
import { useCurrentUserId, useCurrentUserPermissions } from '../../hooks/authHooks';

const MORE_ICON = 'more_vert';

const { SYSTEM_DATA_MANAGER } = permissionTypes;

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

export const openEditForm = (dispatch, asset, editPermissions) => dispatch(
  modalDialogActions.openModalDialog(
    MODAL_TYPE_EDIT_ASSET,
    {
      onSubmit: onEditAssetSubmit(dispatch),
      onCancel: () => dispatch(modalDialogActions.closeModalDialog()),
      asset,
      formComponent: EditRepoMetadataForm,
      editPermissions,
    },
  ),
);

export const onEditAssetSubmit = dispatch => async (asset) => {
  const label = assetLabel(asset);
  dispatch(modalDialogActions.closeModalDialog());
  dispatch(modalDialogActions.openModalDialog(MODAL_TYPE_CONFIRMATION, {
    title: `Edit permissions for asset '${label}'`,
    body: 'Are you sure you want to change permissions?  Note that changing permissions will affect existing notebooks etc.',
    confirmText: 'Confirm Change',
    confirmIcon: 'check',
    onSubmit: () => onEditAssetConfirm(dispatch, asset),
    onCancel: () => dispatch(modalDialogActions.closeModalDialog()),
  }));
};

export const onEditAssetConfirm = async (dispatch, asset) => {
  dispatch(modalDialogActions.closeModalDialog());
  try {
    const assetUpdate = {
      assetId: asset.assetId,
      ownerUserIds: asset.owners ? asset.owners.map(owner => owner.userId) : [],
      visible: asset.visible,
      projectKeys: (asset.visible === BY_PROJECT && asset.projects) ? asset.projects.map(project => project.key) : [],
    };
    await dispatch(assetRepoActions.editRepoMetadata(assetUpdate));
    await reset(FORM_NAME);
    notify.success('Asset updated');
  } catch (error) {
    notify.error('Unable to update asset');
  } finally {
    await dispatch(assetRepoActions.loadAssetsForUser());
  }
};

const getEditPermissions = (userId, userPermissions, asset) => {
  const basePermissions = {
    [OWNERS_FIELD_NAME]: false,
    [VISIBLE_FIELD_NAME]: false,
    ownId: userId,
  };

  // Data Managers can edit any field.
  if (userPermissions.value && userPermissions.value.includes(SYSTEM_DATA_MANAGER)) {
    return {
      ...basePermissions,
      [OWNERS_FIELD_NAME]: true,
      [VISIBLE_FIELD_NAME]: true,
      ownId: null,
    };
  }

  // Data Owners cannot remove themselves from the owners list.
  if (asset.owners && asset.owners.filter(o => o.userId === userId).length > 0) {
    return {
      ...basePermissions,
      [OWNERS_FIELD_NAME]: true,
      [VISIBLE_FIELD_NAME]: true,
    };
  }

  return basePermissions;
};

function AssetAccordion({ asset }) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const history = useHistory();
  const [anchorEl, setAnchorEl] = useState(null);
  const userPermissions = useCurrentUserPermissions();
  const userId = useCurrentUserId();

  const handleMoreButtonClick = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleAddToNotebookClick = (event) => {
    event.stopPropagation();
    history.push(`/add-assets-to-notebook?assets=${asset.assetId}`);
  };

  const handleMenuClose = (event) => {
    event.stopPropagation();
    setAnchorEl(null);
  };

  const editPermissions = getEditPermissions(userId, userPermissions, asset);
  const editable = Object.values(editPermissions).some(p => p === true);

  return (
    <div className={classes.root}>
      <ResourceAccordion defaultExpanded>
        <ResourceAccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h5" className={classes.heading}>{asset.name}: {asset.version}</Typography>
          <div className={classes.buttonDiv}>
            {editable && <PrimaryActionButton
              aria-label="edit"
              onClick={(event) => { openEditForm(dispatch, asset, editPermissions); event.stopPropagation(); }}
            >
              Edit
            </PrimaryActionButton>}
            <SecondaryActionButton
              aria-controls="more-menu"
              aria-haspopup="true"
              onClick={handleMoreButtonClick}
              fullWidth
            >
              <Icon style={{ color: 'inherit' }}>{MORE_ICON}</Icon>
            </SecondaryActionButton>
            <Menu
              id="more-menu"
              anchorEl={anchorEl}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={handleAddToNotebookClick}>
                Add to Notebook
              </MenuItem>
            </Menu>
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
