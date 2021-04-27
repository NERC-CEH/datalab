import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Field, reduxForm, reset } from 'redux-form';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import addRepoMetadataValidator from './addRepoMetadataValidator';
import { formatAndParseMultiSelect, renderTextField, renderSelectField, UpdateFormControls } from '../common/form/controls';
import ConfirmDialog from '../common/ConfirmDialog';
import notify from '../common/notify';
import { useReduxFormValue } from '../../hooks/reduxFormHooks';
import userActions from '../../actions/userActions';
import projectActions from '../../actions/projectActions';
import assetRepoActions from '../../actions/assetRepoActions';
import UserMultiSelect from '../common/form/UserMultiSelect';
import ProjectMultiSelect from '../common/form/ProjectMultiSelect';
import { useAssetRepo } from '../../hooks/assetRepoHooks';
import PrimaryActionButton from '../common/buttons/PrimaryActionButton';
import { BY_PROJECT, visibleOptions } from './assetVisibilities';

const FORM_NAME = 'addRepoMetadata';

const useStyles = makeStyles(theme => ({
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  input: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  addAnotherButton: {
    marginTop: theme.spacing(2),
  },
  addAnotherButtonDiv: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
}));

export default function AddRepoMetadataDetails() {
  const dispatch = useDispatch();
  const classes = useStyles();
  const assetRepo = useAssetRepo();
  const assetId = (assetRepo && assetRepo.value && assetRepo.value.createdAssetId) ? assetRepo.value.createdAssetId : 'Awaiting submission';

  useEffect(() => {
    dispatch(userActions.listUsers());
    dispatch(projectActions.loadProjects());
  }, [dispatch]);

  const [dialogState, setDialogState] = useState({ open: false });
  const [valuesState, setValuesState] = useState({ owners: [], projects: [] });

  const addMetadata = async () => {
    try {
      const { owners, projects, ...formValues } = valuesState;
      const metadata = {
        ...formValues,
        // @ts-ignore - no way to let tsc know the shape of owners
        ownerUserIds: owners ? owners.map(user => user.userId) : [],
        // @ts-ignore - no way to let tsc know the shape of projects
        projectKeys: projects ? projects.map(project => project.key) : [],
      };
      await dispatch(assetRepoActions.addRepoMetadata(metadata));
      notify.success('Metadata set');
    } catch (error) {
      notify.error(error.message || error);
    }
    setDialogState({ open: false });
  };

  const openDialog = (values) => { setDialogState({ open: true }); setValuesState(values); };
  const onCancel = () => dispatch(reset(FORM_NAME));
  const resetForm = () => {
    dispatch(reset(FORM_NAME));
    dispatch(assetRepoActions.clearRepoMetadata());
  };

  return (
    <div>
      <Typography variant="h5">Asset Id: {assetId}</Typography>
      <AddRepoMetadataReduxForm
        onSubmit={openDialog}
        onCancel={onCancel}
      />
      <ConfirmDialog
        onSubmit={addMetadata}
        onCancel={() => setDialogState({ open: false })}
        state={dialogState}
        title="Add Repo Metadata"
        body="Please confirm you wish to add this metadata.  Once added, it can only be adjusted by an administrator in the database."
      />
      { !!assetRepo.value.createdAssetId
        && <div className={classes.addAnotherButtonDiv}>
          <PrimaryActionButton
            className={classes.addAnotherButton}
            onClick={resetForm}
          >
          Add another
        </PrimaryActionButton>
      </div>
      }
    </div>
  );
}

// Redux-Form Component
export function AddRepoMetadata({ handleSubmit, onCancel }) {
  const classes = useStyles();
  const visibleValue = useReduxFormValue(FORM_NAME, 'visible');
  const assetRepo = useAssetRepo();
  const disabled = !!assetRepo.value.createdAssetId;

  const commonProps = {
    component: renderTextField,
    className: classes.input,
    margin: 'dense',
    disabled,
    InputLabelProps: { shrink: true },
  };

  return (
    <form
      className={classes.form}
      onSubmit={handleSubmit}
    >
      <Field
        { ...commonProps }
        name="name"
        label="Name"
      />
      <Field
        { ...commonProps }
        name="version"
        label="Version"
      />
      <Field
        { ...commonProps }
        name="fileLocation"
        label="File location on server.  Can be omitted if the repo is not hosting a local copy."
        placeholder="/file/path/"
      />
      <Field
        { ...commonProps }
        name="masterUrl"
        label="Master URL.  Can be omitted if the asset is only stored in the repo."
        placeholder="https://"
      />
      <Field
        { ...commonProps }
        name="owners"
        component={UserMultiSelect}
        label="Owners"
        selectedTip="User is an owner"
        format={formatAndParseMultiSelect}
        parse={formatAndParseMultiSelect}
      />
      <Field
        { ...commonProps }
        name="visible"
        label="Visibility"
        component={renderSelectField}
        options={visibleOptions}
      />
      { visibleValue === BY_PROJECT
        && <Field
            { ...commonProps }
            name="projects"
            component={ProjectMultiSelect}
            format={formatAndParseMultiSelect}
            parse={formatAndParseMultiSelect}
            />
      }
      { !disabled
        && <UpdateFormControls onCancel={onCancel}/>
      }
    </form>
  );
}

const AddRepoMetadataReduxForm = reduxForm({
  form: FORM_NAME,
  validate: addRepoMetadataValidator,
  destroyOnUnmount: false,
})(AddRepoMetadata);
