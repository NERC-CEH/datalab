import React from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import Button from '@material-ui/core/Button';
import { renderTextField, renderTextArea, renderSelectField, renderAdornedTextField } from '../common/form/controls';
import { syncValidate, asyncValidate } from './newNotebookFormValidator';
import { ANALYSIS, getStackSelections } from '../../../shared/stackTypes';

const CreateNotebookForm = (props) => {
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
          startText="http://datalab-"
          endText=".datalabs.ceh.ac.uk" />
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
        <Button type="submit" style={{ margin: 8 }} color="primary" variant="contained" disabled={submitting}>Create</Button>
        <Button style={{ margin: 8 }} variant="contained" onClick={cancel}>Cancel</Button>
      </div>
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
};
