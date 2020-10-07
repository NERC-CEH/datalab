import React from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import validate from 'validate.js';
import { renderTextArea, renderTextField, UpdateFormControls } from '../common/form/controls';

const validationConstraints = {
  displayName: {
    presence: true,
  },
  description: {
    presence: true,
  },
};

const commonFormProps = {
  onCancel: PropTypes.func.isRequired,
};

const EditStackForm = ({
  handleSubmit, reset, pristine, onCancel,
}) => (
  <form onSubmit={handleSubmit}>
    <Field
      name="displayName"
      label="Display Name"
      component={renderTextField}
    />
    <Field
      name="description"
      label="Description"
      component={renderTextArea}
    />
    <UpdateFormControls onClearChanges={reset} onCancel={onCancel} pristine={pristine} />
  </form>
);

EditStackForm.propTypes = {
  ...commonFormProps,
  handleSubmit: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
};

const EditStackReduxForm = reduxForm({
  form: 'editStackDetails',
  validate: values => validate(values, validationConstraints, { format: 'reduxForm' }),
})(EditStackForm);

EditStackReduxForm.propTypes = {
  ...commonFormProps,
  onSubmit: PropTypes.func.isRequired,
  initialValues: PropTypes.shape({
    displayName: PropTypes.string,
    description: PropTypes.string,
  }),
};

export { EditStackForm as PureEditStackForm };

export default EditStackReduxForm;
