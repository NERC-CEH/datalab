import React from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import Button from '@material-ui/core/Button';
import { renderTextField, renderSelectField, renderTextArea } from '../common/form/controls';
import { syncValidate, asyncValidate } from './newDataStoreFormValidator';
import { DATA_STORE, getStackSelections } from '../../../shared/stackTypes';

const initialValues = { type: 'nfs' };

const CreateDataStoreForm = (props) => {
  const { handleSubmit, cancel, submitting } = props;
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <Field
          name="displayName"
          label="Display Name"
          placeholder="Display Name"
          component={renderTextField} />
      </div>
      <div>
        <Field
          name="type"
          label="Storage Type"
          placeholder="Storage Type"
          component={renderSelectField}
          options={getStackSelections(DATA_STORE)} />
      </div>
      <div>
        <Field
          name="volumeSize"
          label="Storage Size (GB)"
          placeholder="GB"
          component={renderTextField}
          type="number"
          InputProps={{ inputProps: { min: 5, max: 200 } }}
          parse={value => Number(value)} />
      </div>
      <div>
        <Field
          name="name"
          label="Internal Name"
          placeholder="Internal Name"
          component={renderTextField} />
      </div>
      <div>
        <Field
          name="description"
          label="Description"
          placeholder="Description"
          component={renderTextArea} />
      </div>
      <Button style={{ margin: 8 }} type="submit" color="primary" disabled={submitting}>Create</Button>
      <Button style={{ margin: 8 }} onClick={cancel}>Cancel</Button>
    </form>
  );
};

CreateDataStoreForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  cancel: PropTypes.func.isRequired,
};

const CreateDataStoreReduxFrom = reduxForm({
  form: 'createDataStore',
  validate: syncValidate,
  asyncValidate,
  asyncBlurFields: ['name'],
  destroyOnUnmount: false,
  initialValues,
})(CreateDataStoreForm);

export { CreateDataStoreForm as PureCreateDataStoreForm };
export default CreateDataStoreReduxFrom;
