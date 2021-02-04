// TODO - add unit tests
import React from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import { renderTextArea, renderTextField, UpdateFormControls } from '../common/form/controls';
import { syncValidate } from './editNotebookFormValidator';

const formPropTypes = {
  onCancel: PropTypes.func.isRequired,
};

const EditNotebookForm = ({
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

EditNotebookForm.propTypes = {
  ...formPropTypes,
  handleSubmit: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
};

const EditNotebookReduxForm = reduxForm({
  form: 'editNotebookDetails',
  validate: syncValidate,
})(EditNotebookForm);

EditNotebookReduxForm.propTypes = {
  ...formPropTypes,
  onSubmit: PropTypes.func.isRequired,
  initialValues: PropTypes.shape({
    displayName: PropTypes.string,
    description: PropTypes.string,
    assets: formPropTypes.assetsList,
  }),
};

export { EditNotebookForm as PureEditNotebookForm };

export default EditNotebookReduxForm;
