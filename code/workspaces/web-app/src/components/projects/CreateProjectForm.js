import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { withStyles } from '@material-ui/core';
import { syncValidate, asyncValidate } from './newProjectFormValidator';
import { renderTextField, renderTextArea, CreateFormControls } from '../common/form/controls';

const style = theme => ({
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  input: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  button: {
    '& + &': {
      marginLeft: theme.spacing(1),
    },
  },
  buttonContainer: {
    display: 'flex',
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
});

const CreateProjectForm = ({ handleSubmit, onCancel, classes }) => (
  <form
    className={classes.form}
    onSubmit={handleSubmit}
  >
    <Field
      name="name"
      label="Name"
      component={renderTextField}
      className={classes.input}
    />
    <Field
      name="projectKey"
      label="Project Key"
      component={renderTextField}
      className={classes.input}
    />
    <Field
      name="description"
      label="Description"
      component={renderTextArea}
      className={classes.input}
    />
    <Field
      name="collaborationLink"
      label="Collaboration Link"
      component={renderTextField}
      className={classes.input}
    />
    <CreateFormControls onCancel={() => onCancel()} fullWidthButtons />
  </form>
);

const CreateProjectReduxForm = reduxForm({
  form: 'createProject',
  validate: syncValidate,
  asyncValidate,
  asyncBlurFields: ['projectKey'],
  destroyOnUnmount: false,
})(withStyles(style)(CreateProjectForm));

export { CreateProjectForm as PureCreateProjectForm };

export default CreateProjectReduxForm;
