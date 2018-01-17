import React from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import Button from 'material-ui/Button';
import { renderTextField, renderTextArea, renderSelectField, renderAdornedTextField } from '../common/form/controls';
import { syncValidate, asyncValidate } from './newNotebookFormValidator';
import { ANALYSIS, getStackSelections } from '../../../shared/stackTypes';

const fieldStyle = { minWidth: 250 };

const CreateNotebookForm = (props) => {
  const { handleSubmit, cancel, submitting } = props;
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <Field
          style={fieldStyle}
          name="displayName"
          label="Display Name"
          component={renderTextField}
          placeholder="Display Name"
          margin="normal" />
      </div>
      <div>
        <Field
          style={fieldStyle}
          name="type"
          label="Notebook Type"
          component={renderSelectField}
          options={getStackSelections(ANALYSIS)}
          margin="normal" />
      </div>
      <div>
        <Field
          style={fieldStyle}
          name="name"
          label="URL Name"
          component={renderAdornedTextField}
          placeholder="Notebook Name for URL"
          startText="http://datalab-"
          endText=".datalabs.nerc.ac.uk"
          margin="normal" />
      </div>
      <div>
        <Field
          style={fieldStyle}
          name="description"
          label="Description"
          component={renderTextArea}
          placeholder="Description"
          margin="normal" />
      </div>
      <div>
        <Button type="submit" style={{ margin: 8 }} color="primary" raised disabled={submitting}>Create</Button>
        <Button style={{ margin: 8 }} raised onClick={cancel}>Cancel</Button>
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
};
