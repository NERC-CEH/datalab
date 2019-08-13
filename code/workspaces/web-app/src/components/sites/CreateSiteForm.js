import { Field, reduxForm } from 'redux-form';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import React from 'react';
import { stackTypes } from 'common';
import { renderTextField, renderTextArea, renderSelectField, renderAdornedTextField } from '../common/form/controls';
import { syncValidate, asyncValidate } from './newSiteFormValidator';

const { PUBLISH, getStackSelections } = stackTypes;

const CreateSiteForm = (props) => {
  const { handleSubmit, cancel, submitting, dataStorageOptions } = props;
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
          startText="http://datalab-"
          endText=".datalabs.nerc.ac.uk" />
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
      <Button type="submit" style={{ margin: 8 }} color="primary" disabled={submitting}>Create</Button>
      <Button style={{ margin: 8 }} onClick={cancel}>Cancel</Button>
    </form>
  );
};

CreateSiteForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  cancel: PropTypes.func.isRequired,
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
