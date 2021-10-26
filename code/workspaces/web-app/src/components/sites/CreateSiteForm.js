import { Field, reduxForm } from 'redux-form';
import PropTypes from 'prop-types';
import React from 'react';
import { siteVisibilityOptions } from '../common/selectShareOptions';
import { formatAndParseMultiSelect, CreateFormControls, renderAdornedTextField, renderSelectField, renderTextArea, renderTextField } from '../common/form/controls';
import { getAsyncValidate, syncValidate } from './createSiteFormValidator';
import getUrlNameStartEndText from '../../core/urlHelper';
import AssetMultiSelect from '../common/form/AssetMultiSelect';

export const FORM_NAME = 'createSite';
const NAME_FIELD_NAME = 'name';
export const TYPE_FIELD_NAME = 'type';
export const VERSION_FIELD_NAME = 'version';

const commonProps = {
  component: renderTextField,
  InputLabelProps: { shrink: true },
};

const CreateSiteForm = ({
  handleSubmit, cancel, submitting, dataStorageOptions, projectKey, typeOptions, versionOptions, fileField, condaField,
}) => {
  const { startText, endText } = getUrlNameStartEndText(projectKey, window.location);

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <Field
          { ...commonProps }
          name="displayName"
          label="Display Name"
          component={renderTextField}
          placeholder="Display Name" />
      </div>
      <div>
        <Field
          { ...commonProps }
          name={TYPE_FIELD_NAME}
          label="Type"
          component={renderSelectField}
          options={typeOptions}
          placeholder="Site Type" />
      </div>
      {versionOptions && versionOptions.length > 0
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
          placeholder="Site Name for URLs"
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
          name="sourcePath"
          label="Source Path"
          component={renderAdornedTextField}
          placeholder="Source Directory for Site"
          startText="/data/" />
      </div>
      {fileField && <div>
        <Field
          { ...commonProps }
          name="filename"
          label="Filename (optional)"
          helperText="If no filename is specified, the whole directory will be used."
          placeholder="Filename in Source Directory"
        />
        </div>}
      {condaField && <div>
        <Field
          {...commonProps}
          name="condaPath"
          label="Path to Conda environment (optional)"
          helperText="The file path to the conda environment to use."
          placeholder="/data/conda/conda-env"
        />
        </div>}
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
          name="visible"
          label="Visibility Status"
          component={renderSelectField}
          options={siteVisibilityOptions}/>
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

const dropDownOptionsType = PropTypes.arrayOf(PropTypes.shape({
  text: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
}));

CreateSiteForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  cancel: PropTypes.func.isRequired,
  dataStorageOptions: dropDownOptionsType.isRequired,
  projectKey: PropTypes.string.isRequired,
  typeOptions: dropDownOptionsType.isRequired,
  versionOptions: dropDownOptionsType.isRequired,
  fileField: PropTypes.bool,
  condaField: PropTypes.bool,
};

const CreateSiteReduxForm = reduxForm({
  form: FORM_NAME,
  validate: syncValidate,
  asyncValidate: getAsyncValidate(NAME_FIELD_NAME, TYPE_FIELD_NAME),
  asyncBlurFields: [NAME_FIELD_NAME, TYPE_FIELD_NAME],
  destroyOnUnmount: false,
})(CreateSiteForm);

export { CreateSiteForm as PureCreateSiteForm };
export default CreateSiteReduxForm;
