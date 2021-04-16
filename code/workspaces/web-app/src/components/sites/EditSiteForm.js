import React from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import { formatAndParseMultiSelect, renderTextArea, renderTextField, UpdateFormControls } from '../common/form/controls';
import { syncValidate } from './editSiteFormValidator';
import AssetMultiSelect from '../common/form/AssetMultiSelect';

const commonFormProps = {
  onCancel: PropTypes.func.isRequired,
  projectKey: PropTypes.string.isRequired,
};

const commonProps = {
  component: renderTextField,
  InputLabelProps: { shrink: true },
};

const EditSiteForm = ({
  handleSubmit, reset, pristine, onCancel, projectKey,
}) => (
  <form onSubmit={handleSubmit}>
    <Field
      { ...commonProps }
      name="displayName"
      label="Display Name"
      component={renderTextField}
    />
    <Field
      { ...commonProps }
      name="description"
      label="Description"
      component={renderTextArea}
    />
    <Field
      { ...commonProps }
      name="assets"
      label="Assets"
      component={AssetMultiSelect}
      projectKey={projectKey}
      format={formatAndParseMultiSelect}
      parse={formatAndParseMultiSelect}
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
