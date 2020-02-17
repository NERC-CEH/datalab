import React from 'react';
import { useDispatch } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { withStyles } from '@material-ui/core/styles';
import { useCurrentProject } from '../../hooks/currentProjectHooks';
import projectActions from '../../actions/projectActions';
import syncValidate from '../projects/updateProjectFormValidator';
import { renderTextField, renderTextArea, UpdateFormControls } from '../common/form/controls';
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

  const updateProject = async (values) => {
    try {
      const projectKey = project.key;
      const projectObject = { projectKey, ...values };
      await dispatchEditProjectDetails(projectObject, dispatch);
      notify.success('Project updated');
    } catch (error) {
      notify.error(`Error updating Project: ${error.message}`);
    }
  };

  return (
    <EditProjectReduxForm
      project={project}
      onSubmit={updateProject}
    />
  );
}

// Redux-Form Component

function EditProject({ classes, project, handleSubmit }) {
  return (
    <form
      className={classes.form}
      onSubmit={handleSubmit}
    >
      <Field
        name="name"
        label="Name"
        component={renderTextField}
        margin="dense"
        InputLabelProps={{ shrink: true }}
        placeholder={project.name}
        className={classes.input}
      />
      <Field
        name="description"
        label="Description"
        component={renderTextArea}
        className={classes.input}
        margin="dense"
        InputLabelProps={{ shrink: true }}
        placeholder={project.description}
      />
      <Field
        name="collaborationLink"
        label="Collaboration Link"
        component={renderTextField}
        className={classes.input}
        margin="dense"
        InputLabelProps={{ shrink: true }}
        placeholder={project.collaborationLink}
      />
      <UpdateFormControls />
    </form>
  );
}

function dispatchEditProjectDetails(project, dispatch) {
  dispatch(
    projectActions.updateProject(
      project,
    ),
  );
}

const EditProjectReduxForm = reduxForm({
  form: 'updateProject',
  validate: syncValidate,
  destroyOnUnmount: false,
})(withStyles(styles)(EditProject));

export { EditProject as PureEditProject };
