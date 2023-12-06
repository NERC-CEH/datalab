import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import { useReduxFormValue } from '../../hooks/reduxFormHooks';
import ProjectMultiSelect from '../common/form/ProjectMultiSelect';
import UserMultiSelect from '../common/form/UserMultiSelect';
import { UpdateFormControls, formatAndParseMultiSelect, renderSelectField, renderTextField } from '../common/form/controls';
import { BY_PROJECT, visibleOptions } from './assetVisibilities';
import { syncValidate } from './editRepoMetadataValidator';

export const FORM_NAME = 'editAssetDetails';

export const OWNERS_FIELD_NAME = 'owners';
export const VISIBLE_FIELD_NAME = 'visible';
export const CITATIONSTRING_FIELD_NAME = 'citationString';
export const LICENSE_FIELD_NAME = 'license';
export const PUBLISHER_FIELD_NAME = 'publisher';

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
  const licenseOptions = [{ value: 'OGL', text: 'OGL' }, { value: null, text: 'No license' }];
  const publisherOptions = [{ value: 'EIDC', text: 'EIDC' }, { value: null, text: 'No publisher' }];

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
    <Field
      { ...commonProps }
      name={CITATIONSTRING_FIELD_NAME}
      label="Citation String"
  />
    <Field
      { ...commonProps }
      name={LICENSE_FIELD_NAME}
      label="License"
      component={renderSelectField}
      options={licenseOptions}
  />
    <Field
      { ...commonProps }
      name={PUBLISHER_FIELD_NAME}
      label="Publisher"
      component={renderSelectField}
      options={publisherOptions}
  />
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
    citationString: PropTypes.string,
    license: PropTypes.string,
    publisher: PropTypes.string,
  }),
};

export { EditRepoMetadataForm as PureEditRepoMetadataForm };

export default EditRepoMetadataReduxForm;
