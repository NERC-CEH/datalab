import React from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import { Button, Form } from 'semantic-ui-react';
import { renderTextField, renderDropdownField } from '../common/form/controls';

const notebookTypes = [
  { key: 'jupyter', text: 'Jupyter', value: 'jupyter' },
  { key: 'zeppelin', text: 'Zeppelin', value: 'zeppelin' },
];

const PureCreateNotebookForm = (props) => {
  const { handleSubmit } = props;
  return (
    <Form onSubmit={ handleSubmit }>
      <Field name="name" label="Name" component={renderTextField} placeholder='Notebook Name' />
      <Field name="displayName" label="Display Name" component={renderTextField} placeholder='Display Name' />
      <Field name="type" label="Notebook Type" component={renderDropdownField} options={notebookTypes} placeholder='Notebook Type'/>
      <Button type="submit">Submit</Button>
    </Form>
  );
};

const CreateNotebookForm = reduxForm({
  form: 'createNotebook',
})(PureCreateNotebookForm);

export default CreateNotebookForm;

CreateNotebookForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};
