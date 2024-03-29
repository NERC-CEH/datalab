import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Icon from '@mui/material/Icon';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';
import { Box } from '@mui/material';
import { reset } from 'redux-form';
import { permissionTypes } from 'common';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import assetRepoActions from '../../actions/assetRepoActions';
import modalDialogActions from '../../actions/modalDialogActions';
import { MODAL_TYPE_CONFIRMATION, MODAL_TYPE_EDIT_ASSET } from '../../constants/modaltypes';
import { useCurrentUserId, useCurrentUserPermissions } from '../../hooks/authHooks';
import { ResourceAccordion, ResourceAccordionDetails, ResourceAccordionSummary } from '../common/ResourceAccordion';
import PrimaryActionButton from '../common/buttons/PrimaryActionButton';
import SecondaryActionButton from '../common/buttons/SecondaryActionButton';
import assetLabel from '../common/form/assetLabel';
import notify from '../common/notify';
import AssetCard from './AssetCard';
import EditRepoMetadataForm, { FORM_NAME, OWNERS_FIELD_NAME, VISIBLE_FIELD_NAME } from './EditRepoMetadataForm';
import { BY_PROJECT } from './assetVisibilities';
import eidcLogo from '../../assets/images/eidc.png';

const MORE_ICON = 'more_vert';

const { SYSTEM_DATA_MANAGER } = permissionTypes;

const useStyles = makeStyles(theme => ({
  root: {
    marginBottom: theme.spacing(3),
  },
  eidcAsset: {
    border: 3,
    borderColor: theme.palette.primary.main,
    borderRadius: 5,
    borderStyle: 'solid',
    borderWidth: 2,
    padding: theme.spacing(2),
  },
  eidcLogo: {
    maxHeight: 40,
    marginLeft: theme.spacing(2),
  },
  resources: {
    marginLeft: theme.spacing(8),
  },
  heading: {
    margin: `${theme.spacing(2)} 0`,
  },
  buttonDiv: {
    display: 'flex',
    alignItems: 'center',
    paddingTop: theme.spacing(2),
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
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
      ...(asset.citationString) && { citationString: asset.citationString },
      ...(asset.license) && { license: asset.license },
      ...(asset.publisher) && { publisher: asset.publisher },
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
  const isEIDCAsset = (asset.publisher === 'EIDC');

  return (
    <div className={classes.root}>
      <ResourceAccordion defaultExpanded className={isEIDCAsset ? classes.eidcAsset : ''}>
        <ResourceAccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h5" className={classes.heading}>{asset.name}</Typography>

          {isEIDCAsset && <Box className={classes.eidcLogo}
            component='img'
            alt='EIDC logo'
            src={eidcLogo}
          />}

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
