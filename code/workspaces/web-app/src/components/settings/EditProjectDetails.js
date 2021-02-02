import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Field, reduxForm, reset } from 'redux-form';
import { withStyles } from '@material-ui/core/styles';
import { useCurrentProject } from '../../hooks/currentProjectHooks';
import projectActions from '../../actions/projectActions';
import syncValidate from '../projects/updateProjectFormValidator';
import { renderTextField, renderTextArea, UpdateFormControls } from '../common/form/controls';
import ConfirmDialog from '../common/ConfirmDialog';
import notify from '../common/notify';

const styles = theme => ({
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  input: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
});

export default function EditProjectDetails() {
  const project = useCurrentProject().value;
  const dispatch = useDispatch();

  const [editProjectDialogState, setEditProjectDialogState] = useState({ open: false, values: {} });

  const updateProject = async () => {
    try {
      const formValues = editProjectDialogState.values;
      const projectKey = project.key;
      const projectObject = { projectKey, ...formValues };

      await dispatchEditProjectDetails(projectObject, dispatch);
      notify.success('Project updated');
    } catch (error) {
      notify.error(`Error updating Project: ${error.message}`);
    }
    setEditProjectDialogState({ open: false });
  };

  const openDialog = values => (setEditProjectDialogState({ open: true, values }));
  const onCancel = () => (dispatch(reset('updateProject')));

  return (
    <div>
      <EditProjectReduxForm
        project={project}
        onSubmit={openDialog}
        onCancel={onCancel}
        editProjectDialogState={editProjectDialogState}
        setEditProjectDialogState={setEditProjectDialogState}
      />
      <ConfirmDialog
        onSubmit={updateProject}
        onCancel={() => setEditProjectDialogState({ open: false })}
        state={editProjectDialogState}
        setState={setEditProjectDialogState}
        title="Edit Project"
        body="Please confirm you wish to edit this project"
        dispatch={dispatch}
      />
    </div>
  );
}

// Redux-Form Component
function EditProject({ classes, project, handleSubmit, onCancel }) {
  const commonProps = {
    component: renderTextField,
    className: classes.input,
    margin: 'dense',
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
        placeholder={project.name}
      />
      <Field
        { ...commonProps }
        name="description"
        label="Description"
        component={renderTextArea}
        placeholder={project.description}
      />
      <Field
        { ...commonProps }
        name="collaborationLink"
        label="Collaboration Link"
        placeholder={project.collaborationLink}
      />
      <UpdateFormControls onCancel={onCancel}/>
    </form>
  );
}

function dispatchEditProjectDetails(project, dispatch) {
  dispatch(
    projectActions.updateProject(
      project,
    ),
  );
  dispatch(
    projectActions.setCurrentProject(
      project.projectKey,
    ),
  );
}

const EditProjectReduxForm = reduxForm({
  form: 'updateProject',
  validate: syncValidate,
  destroyOnUnmount: false,
})(withStyles(styles)(EditProject));

export { EditProject as PureEditProject };
