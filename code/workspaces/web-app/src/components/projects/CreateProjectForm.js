import React from 'react';
import { Field, reduxForm } from 'redux-form';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core';
import { syncValidate, asyncValidate } from './newProjectFormValidator';
import { renderTextField, renderTextArea } from '../common/form/controls';

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
    <div className={classes.buttonContainer}>
      <Button
        className={classes.button}
        type="submit"
        variant="outlined"
        color="primary"
        fullWidth
      >
        Create
      </Button>
      <Button
        className={classes.button}
        variant="outlined"
        color="secondary"
        onClick={() => onCancel()}
        fullWidth
      >
        Cancel
      </Button>
    </div>
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
