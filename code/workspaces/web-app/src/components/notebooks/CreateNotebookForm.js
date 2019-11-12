import { Field, reduxForm } from 'redux-form';
import PropTypes from 'prop-types';
import React from 'react';
import { stackTypes } from 'common';
import sharingOptions from './NotebookSharingOptions';
import { renderTextField, renderTextArea, renderSelectField, renderAdornedTextField, CreateFormControls } from '../common/form/controls';
import { syncValidate, asyncValidate } from './newNotebookFormValidator';
import getUrlNameStartEndText from '../../core/urlHelper';

const { ANALYSIS, getStackSelections } = stackTypes;

const CreateNotebookForm = (props) => {
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
          label="Notebook Type"
          component={renderSelectField}
          options={getStackSelections(ANALYSIS)} />
      </div>
      <div>
        <Field
          name="name"
          label="URL Name"
          component={renderAdornedTextField}
          placeholder="Notebook Name for URL"
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
          name="description"
          label="Description"
          component={renderTextArea}
          placeholder="Description" />
      </div>
      <div>
        <Field
          name="shared"
          label="Sharing Status"
          component={renderSelectField}
          options={sharingOptions}/>
      </div>
      <CreateFormControls onCancel={cancel} submitting={submitting} />
    </form>
  );
};

const CreateNotebookReduxForm = reduxForm({
  form: 'createNotebook',
  validate: syncValidate,
  asyncValidate,
  asyncBlurFields: ['name'],
  destroyOnUnmount: false,
})(CreateNotebookForm);

export { CreateNotebookForm as PureCreateNotebookForm };
export default CreateNotebookReduxForm;

CreateNotebookForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  cancel: PropTypes.func.isRequired,
  dataStorageOptions: PropTypes.arrayOf(PropTypes.shape({
    text: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
  })).isRequired,
  projectKey: PropTypes.string.isRequired,
};
