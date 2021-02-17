import React from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import { formatAndParseMultiSelect, renderTextArea, renderTextField, UpdateFormControls } from '../common/form/controls';
import { syncValidate } from './editNotebookFormValidator';
import AssetMultiSelect from '../common/form/AssetMultiSelect';
import { useCurrentProject } from '../../hooks/currentProjectHooks';

const formPropTypes = {
  onCancel: PropTypes.func.isRequired,
};

const commonProps = {
  component: renderTextField,
  InputLabelProps: { shrink: true },
};

const EditNotebookForm = ({
  handleSubmit, reset, pristine, onCancel,
}) => {
  const currentProject = useCurrentProject();
  return (
  <form onSubmit={handleSubmit}>
    <Field
      { ...commonProps }
      name="displayName"
      label="Display Name"
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
      projectKey={currentProject.value.key}
      format={formatAndParseMultiSelect}
      parse={formatAndParseMultiSelect}
    />
    <UpdateFormControls onClearChanges={reset} onCancel={onCancel} pristine={pristine} />
  </form>
  );
};

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
