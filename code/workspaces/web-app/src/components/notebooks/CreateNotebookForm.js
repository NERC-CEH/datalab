import { Field, reduxForm } from 'redux-form';
import PropTypes from 'prop-types';
import React from 'react';
import { notebookSharingOptions } from '../common/selectShareOptions';
import { formatAndParseMultiSelect, CreateFormControls, renderAdornedTextField, renderSelectField, renderTextArea, renderTextField } from '../common/form/controls';
import { getAsyncValidate, syncValidate } from './createNotebookFormValidator';
import getUrlNameStartEndText from '../../core/urlHelper';
import AssetMultiSelect from '../common/form/AssetMultiSelect';
import { useReduxFormValue } from '../../hooks/reduxFormHooks';

export const FORM_NAME = 'createNotebook';
const NAME_FIELD_NAME = 'name';
export const TYPE_FIELD_NAME = 'type';
export const VERSION_FIELD_NAME = 'version';

const commonProps = {
  component: renderTextField,
  InputLabelProps: { shrink: true },
};

const CreateNotebookForm = ({
  handleSubmit, cancel, submitting, dataStorageOptions, projectKey, typeOptions, versionOptions,
}) => {
  const typeValue = useReduxFormValue(FORM_NAME, TYPE_FIELD_NAME);
  const { startText, endText } = getUrlNameStartEndText(projectKey, window.location, typeValue);

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <Field
          { ...commonProps }
          name="displayName"
          label="Display Name"
          placeholder="Display Name"
        />
      </div>
      <div>
        <Field
          { ...commonProps }
          name={TYPE_FIELD_NAME}
          label="Type"
          component={renderSelectField}
          options={typeOptions} />
      </div>
      {
        versionOptions && versionOptions.length > 0
        && <div>
          <Field
            { ...commonProps }
            name={VERSION_FIELD_NAME}
            label="Version"
            component={renderSelectField}
            options={versionOptions}
          />
        </div>
      }
      <div>
        <Field
          { ...commonProps }
          name={NAME_FIELD_NAME}
          label="URL Name"
          component={renderAdornedTextField}
          placeholder="Notebook Name for URL"
          startText={startText}
          endText={endText} />
      </div>
      <div>
        <Field
          { ...commonProps }
          name="volumeMount"
          label="Data Store to Mount"
          component={renderSelectField}
          options={dataStorageOptions}/>
      </div>
      <div>
        <Field
          { ...commonProps }
          name="description"
          label="Description"
          component={renderTextArea}
          placeholder="Description" />
      </div>
      <div>
        <Field
          { ...commonProps }
          name="shared"
          label="Sharing Status"
          component={renderSelectField}
          options={notebookSharingOptions}/>
      </div>
      <div>
        <Field
          { ...commonProps }
          name="assets"
          label="Assets"
          component={AssetMultiSelect}
          projectKey={projectKey}
          format={formatAndParseMultiSelect}
          parse={formatAndParseMultiSelect}
        />
      </div>
      <CreateFormControls onCancel={cancel} submitting={submitting} />
    </form>
  );
};

const CreateNotebookReduxForm = reduxForm({
  form: FORM_NAME,
  validate: syncValidate,
  asyncValidate: getAsyncValidate(NAME_FIELD_NAME, TYPE_FIELD_NAME),
  asyncBlurFields: [NAME_FIELD_NAME, TYPE_FIELD_NAME],
  destroyOnUnmount: false,
})(CreateNotebookForm);

export { CreateNotebookForm as PureCreateNotebookForm };
export default CreateNotebookReduxForm;

const dropDownOptionType = PropTypes.shape({
  text: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
});

const dropDownOptionArrayType = PropTypes.arrayOf(dropDownOptionType);

CreateNotebookForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  cancel: PropTypes.func.isRequired,
  dataStorageOptions: dropDownOptionArrayType.isRequired,
  projectKey: PropTypes.string.isRequired,
  typeOptions: dropDownOptionArrayType.isRequired,
  versionOptions: dropDownOptionArrayType.isRequired,
};
