import React from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import { renderTextArea, renderTextField, UpdateFormControls } from '../common/form/controls';
import { syncValidate } from './editSiteFormValidator';

const commonFormProps = {
  onCancel: PropTypes.func.isRequired,
};

const EditSiteForm = ({
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

EditSiteForm.propTypes = {
  ...commonFormProps,
  handleSubmit: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
};

const EditSiteReduxForm = reduxForm({
  form: 'editSiteDetails',
  validate: syncValidate,
})(EditSiteForm);

EditSiteReduxForm.propTypes = {
  ...commonFormProps,
  onSubmit: PropTypes.func.isRequired,
  initialValues: PropTypes.shape({
    displayName: PropTypes.string,
    description: PropTypes.string,
  }),
};

export { EditSiteForm as PureEditSiteForm };

export default EditSiteReduxForm;
