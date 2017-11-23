import React from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import Button from 'material-ui/Button';
import { renderTextField, renderTextArea, renderSelectField, renderAdornedTextField } from '../common/form/controls';
import { syncValidate, asyncValidate } from './newSiteFormValidator';
import { PUBLISH, getStackSelections } from '../../../shared/stackTypes';

const CreateSiteForm = (props) => {
  const { handleSubmit, cancel, submitting } = props;
  return (
    <form onSubmit={ handleSubmit }>
      <div>
        <Field name="displayName" label="Display Name" component={renderTextField} placeholder="Display Name" margin="normal" />
      </div>
      <div>
        <Field name="type" label="Site Type" component={renderSelectField} options={getStackSelections(PUBLISH)} placeholder="Site Type" style={{ minWidth: 120 }} margin="normal" />
      </div>
      <div>
        <Field name="name" label="URL Name" component={renderAdornedTextField} placeholder="Site Name for URLs" startText="http://datalab-" endText=".datalabs.nerc.ac.uk" margin="normal" />
      </div>
      <div>
        <Field name="sourcePath" label="Source Path" component={renderAdornedTextField} placeholder="Source Directory for Site" startText="/data/" margin="normal" />
      </div>
      <div>
        <Field name="description" label="Description" component={renderTextArea} placeholder="Description" margin="normal" />
      </div>
      <Button type="submit" style={{ margin: 8 }} color="primary" raised disabled={submitting}>Create</Button>
      <Button style={{ margin: 8 }} raised onClick={cancel}>Cancel</Button>
    </form>
  );
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

CreateSiteForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  cancel: PropTypes.func.isRequired,
};
