import { Field, reduxForm } from 'redux-form';
import PropTypes from 'prop-types';
import React from 'react';
import { stackTypes } from 'common';
import { siteVisibilityOptions } from '../common/selectShareOptions';
import { renderTextField, renderTextArea, renderSelectField, renderAdornedTextField, CreateFormControls } from '../common/form/controls';
import { syncValidate, asyncValidate } from './newSiteFormValidator';
import getUrlNameStartEndText from '../../core/urlHelper';

const { PUBLISH, getStackSelections } = stackTypes;

const CreateSiteForm = (props) => {
  const { handleSubmit, cancel, submitting, dataStorageOptions, projectKey } = props;
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
          name="type"
          label="Site Type"
          component={renderSelectField}
          options={getStackSelections(PUBLISH)}
          placeholder="Site Type" />
      </div>
      <div>
        <Field
          name="name"
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

CreateSiteForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  cancel: PropTypes.func.isRequired,
  dataStorageOptions: PropTypes.arrayOf(PropTypes.shape({
    text: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
  })).isRequired,
  projectKey: PropTypes.string.isRequired,
};

const CreateSiteReduxForm = reduxForm({
  form: 'createSite',
  validate: syncValidate,
  asyncValidate,
  asyncBlurFields: ['name'],
  destroyOnUnmount: false,
})(CreateSiteForm);

export { CreateSiteForm as PureCreateSiteForm };
export default CreateSiteReduxForm;
