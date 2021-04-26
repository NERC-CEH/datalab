import React from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import { formatAndParseMultiSelect, renderTextField, UpdateFormControls, renderSelectField } from '../common/form/controls';
import { syncValidate } from './editRepoMetadataValidator';
import UserMultiSelect from '../common/form/UserMultiSelect';
import ProjectMultiSelect from '../common/form/ProjectMultiSelect';
import { visibleOptions } from './AddRepoMetadataDetails';
import { useReduxFormValue } from '../../hooks/reduxFormHooks';

export const FORM_NAME = 'editAssetDetails';

const formPropTypes = {
  onCancel: PropTypes.func.isRequired,
};

const commonProps = {
  component: renderTextField,
  InputLabelProps: { shrink: true },
};

const EditRepoMetadataForm = ({
  handleSubmit, reset, pristine, onCancel,
}) => {
  const visibleValue = useReduxFormValue(FORM_NAME, 'visible');

  return (
  <form onSubmit={handleSubmit}>
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

    <UpdateFormControls onClearChanges={reset} onCancel={onCancel} pristine={pristine} />
  </form>
  );
};

EditRepoMetadataForm.propTypes = {
  ...formPropTypes,
  handleSubmit: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
};

const EditRepoMetadataReduxForm = reduxForm({
  form: FORM_NAME,
  validate: syncValidate,
})(EditRepoMetadataForm);

EditRepoMetadataReduxForm.propTypes = {
  ...formPropTypes,
  onSubmit: PropTypes.func.isRequired,
  initialValues: PropTypes.shape({
    owners: PropTypes.arrayOf(PropTypes.object).isRequired,
    projects: PropTypes.arrayOf(PropTypes.object).isRequired,
    visible: PropTypes.string.isRequired,
  }),
};

export { EditRepoMetadataForm as PureEditRepoMetadataForm };

export default EditRepoMetadataReduxForm;
