import React from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import { Button, Form } from 'semantic-ui-react';
import { renderTextField, renderTextArea, renderDropdownField } from '../common/form/controls';
import renderUrlTextField from '../common/form/urlTextField';
import renderPrefixedTextField from '../common/form/prefixedTextField';
import { syncValidate, asyncValidate } from './newSiteFormValidator';
import { PUBLISH, getStackSelections } from '../../../shared/stackTypes';

const CreateSiteForm = (props) => {
  const { handleSubmit, cancel, submitting } = props;
  return (
    <Form onSubmit={ handleSubmit }>
      <Field name='displayName' label='Display Name' component={renderTextField} placeholder='Display Name' />
      <Field name='type' label='Site Type' component={renderDropdownField} options={getStackSelections(PUBLISH)} placeholder='Site Type'/>
      <Field name='name' label='URL Name' component={renderUrlTextField} placeholder='Notebook Name for URLs' />
      <Field name='sourcePath' label='Source Path' prefix='/data/' component={renderPrefixedTextField} placeholder='Source directory for site' />
      <Field name='description' label='Description' component={renderTextArea} placeholder='Description' />
      <Button type='submit' disabled={submitting} primary>Create</Button>
      <Button type='button' onClick={cancel}>Cancel</Button>
    </Form>
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
