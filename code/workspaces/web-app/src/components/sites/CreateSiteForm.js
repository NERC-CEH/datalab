import { Field, reduxForm } from 'redux-form';
import PropTypes from 'prop-types';
import React from 'react';
import { siteVisibilityOptions } from '../common/selectShareOptions';
import { CreateFormControls, renderAdornedTextField, renderSelectField, renderTextArea, renderTextField } from '../common/form/controls';
import { getAsyncValidate, syncValidate } from './createSiteFormValidator';
import getUrlNameStartEndText from '../../core/urlHelper';

export const FORM_NAME = 'createSite';
const NAME_FIELD_NAME = 'name';
export const TYPE_FIELD_NAME = 'type';
export const VERSION_FIELD_NAME = 'version';

const CreateSiteForm = ({
  handleSubmit, cancel, submitting, dataStorageOptions, projectKey, typeOptions, versionOptions,
}) => {
  const { startText, endText } = getUrlNameStartEndText(projectKey, window.location);

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <Field
          name="displayName"
          label="Display Name"
          component={renderTextField}
          placeholder="Display Name" />
      </div>
      <div>
        <Field
          name={TYPE_FIELD_NAME}
          label="Type"
          component={renderSelectField}
          options={typeOptions}
          placeholder="Site Type" />
      </div>
      {versionOptions && versionOptions.length > 0
        && <div>
          <Field
            name={VERSION_FIELD_NAME}
            label="Version"
            component={renderSelectField}
            options={versionOptions}
          />
        </div>
      }
      <div>
        <Field
          name={NAME_FIELD_NAME}
          label="URL Name"
          component={renderAdornedTextField}
          placeholder="Site Name for URLs"
          startText={startText}
          endText={endText} />
      </div>
      <div>
        <Field
          name="volumeMount"
          label="Data Store to Mount"
          component={renderSelectField}
          options={dataStorageOptions}/>
      </div>
      <div>
        <Field
          name="sourcePath"
          label="Source Path"
          component={renderAdornedTextField}
          placeholder="Source Directory for Site"
          startText="/data/" />
      </div>
      <div>
        <Field
          name="description"
          label="Description"
          component={renderTextArea}
          placeholder="Description" />
      </div>
      <div>
        <Field
          name="visible"
          label="Visibility Status"
          component={renderSelectField}
          options={siteVisibilityOptions}/>
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
