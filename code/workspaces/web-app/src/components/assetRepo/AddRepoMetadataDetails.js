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
  const assetId = assetRepo.value ? assetRepo.value : 'Awaiting submission';

  useEffect(() => {
    dispatch(userActions.listUsers());
    dispatch(projectActions.loadProjects());
  }, [dispatch]);

  const [addRepoMetadataDialogState, setAddRepoMetadataDialogState] = useState({ open: false, values: {} });

  const addMetadata = async () => {
    try {
      const formValues = addRepoMetadataDialogState.values;
      const metadata = {
        ...formValues,
        owners: formValues.owners.map(user => user.userId),
        projects: formValues.projects ? formValues.projects.map(project => project.key) : [],
      };
      await dispatch(assetRepoActions.addRepoMetadata(metadata));
      notify.success('Metadata set');
    } catch (error) {
      notify.error(`Error updating metadata: ${error.message}`);
    }
    setAddRepoMetadataDialogState({ open: false });
  };

  const openDialog = values => (setAddRepoMetadataDialogState({ open: true, values }));
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
        addRepoMetadataDialogState={addRepoMetadataDialogState}
        setAddRepoMetadataDialogState={setAddRepoMetadataDialogState}
      />
      <ConfirmDialog
        onSubmit={addMetadata}
        onCancel={() => setAddRepoMetadataDialogState({ open: false })}
        state={addRepoMetadataDialogState}
        setState={setAddRepoMetadataDialogState}
        title="Add Repo Metadata"
        body="Please confirm you wish to add this metadata.  Once added, it can only be adjusted by an administrator in the database."
        dispatch={dispatch}
      />
      { assetRepo.value
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
  const masterUrlValue = useReduxFormValue(FORM_NAME, 'masterUrl');
  const visibleValue = useReduxFormValue(FORM_NAME, 'visible');
  const assetRepo = useAssetRepo();
  const disabled = !!assetRepo.value;

  const commonProps = {
    component: renderTextField,
    className: classes.input,
    margin: 'dense',
    disabled,
  };

  const typeOptions = [
    { value: 'DATASET', text: 'Data set' },
    { value: 'NOTEBOOK', text: 'Notebook' },
    { value: 'SNIPPET', text: 'Snippet' },
  ];

  const visibleOptions = [
    { value: 'PUBLIC', text: 'Public: Asset will be visible to all projects' },
    { value: 'BY_PROJECT', text: 'By project: Asset is only visible to selected projects' },
  ];

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
        name="type"
        label="Type"
        component={renderSelectField}
        options={typeOptions}
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
      {masterUrlValue && masterUrlValue.length > 0
        && <Field
            { ...commonProps }
            name="masterVersion"
            label="Master version, e.g. a commit ID in a git repo."
          />
      }
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
      { visibleValue === 'BY_PROJECT'
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
