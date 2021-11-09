import React from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import { formatAndParseMultiSelect, renderTextField, UpdateFormControls, renderSelectField } from '../common/form/controls';
import { syncValidate } from './editRepoMetadataValidator';
import UserMultiSelect from '../common/form/UserMultiSelect';
import ProjectMultiSelect from '../common/form/ProjectMultiSelect';
import { visibleOptions, BY_PROJECT } from './assetVisibilities';
import { useReduxFormValue } from '../../hooks/reduxFormHooks';

export const FORM_NAME = 'editAssetDetails';

export const OWNERS_FIELD_NAME = 'owners';
export const VISIBLE_FIELD_NAME = 'visible';

const formPropTypes = {
  onCancel: PropTypes.func.isRequired,
};

const commonProps = {
  component: renderTextField,
  InputLabelProps: { shrink: true },
};

const getFixedOptions = (editPermissions, initialValues) => {
  if (!editPermissions[OWNERS_FIELD_NAME]) {
    // If the user doesn't have edit permissions on the field, lock all existing options
    //  (this still allows for adding new entries).
    return initialValues.owners;
  }

  if (!editPermissions.ownId) {
    return [];
  }

  // Lock entries matching the user's ID so they cannot remove themselves.
  return initialValues.owners.filter(o => o.userId === editPermissions.ownId);
};

const EditRepoMetadataForm = ({
  handleSubmit, reset, pristine, onCancel, editPermissions, initialValues,
}) => {
  const visibleValue = useReduxFormValue(FORM_NAME, VISIBLE_FIELD_NAME);
  const fixedOptions = getFixedOptions(editPermissions, initialValues);

  return (
  <form onSubmit={handleSubmit}>
    <Field
      { ...commonProps }
      name={OWNERS_FIELD_NAME}
      component={UserMultiSelect}
      label="Owners"
      selectedTip="User is an owner"
      format={formatAndParseMultiSelect}
      parse={formatAndParseMultiSelect}
      fixedOptions={fixedOptions}
  />
    <Field
      { ...commonProps }
      name={VISIBLE_FIELD_NAME}
      disabled={!editPermissions[VISIBLE_FIELD_NAME]}
      label="Visibility"
      component={renderSelectField}
      options={visibleOptions}
  />
      { visibleValue === BY_PROJECT
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
  editPermissions: PropTypes.shape({
    [OWNERS_FIELD_NAME]: PropTypes.bool,
    [VISIBLE_FIELD_NAME]: PropTypes.bool,
    ownId: PropTypes.string,
  }).isRequired,
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
