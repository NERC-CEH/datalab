import React from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import { Button, Form } from 'semantic-ui-react';
import { renderTextField, renderTextArea, renderDropdownField } from '../common/form/controls';
import renderUrlTextField from '../common/form/urlTextField';

const notebookTypes = [
  { text: 'Jupyter', value: 'jupyter' },
  { text: 'Zeppelin', value: 'zeppelin' },
];

const CreateNotebookForm = (props) => {
  const { handleSubmit } = props;
  return (
    <Form onSubmit={ handleSubmit }>
      <Field name='displayName' label='Display Name' component={renderTextField} placeholder='Display Name' />
      <Field name='type' label='Notebook Type' component={renderDropdownField} options={notebookTypes} placeholder='Notebook Type'/>
      <Field name='name' label='URL Name' component={renderUrlTextField} placeholder='Notebook Name for URLs' />
      <Field name='description' label='Description' component={renderTextArea} placeholder='Description' />
      <Button type='submit' primary>Create</Button>
    </Form>
  );
};

const CreateNotebookReduxForm = reduxForm({
  form: 'createNotebook',
})(CreateNotebookForm);

export { CreateNotebookForm as PureCreateNotebookForm };
export default CreateNotebookReduxForm;

CreateNotebookForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};
