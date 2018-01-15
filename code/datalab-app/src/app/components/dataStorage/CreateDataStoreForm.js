import React from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import Button from 'material-ui/Button';
import { renderTextField, renderSelectField } from '../common/form/controls';
// import { syncValidate, asyncValidate } from './newDataStoreValidator';
import { DATA_STORE, getStackSelections } from '../../../shared/stackTypes';

const CreateDataStoreForm = (props) => {
  const { handleSubmit, cancel, submitting } = props;
  return (
    <form onSubmit={ handleSubmit }>
      <div>
        <Field
          name="name"
          label="Claim Name"
          placeholder="Claim Name"
          component={renderTextField}
          margin="normal" />
      </div>
      <div>
        <Field
          style={{ minWidth: 120 }}
          name="type"
          label="Type"
          placeholder="Type"
          component={renderSelectField}
          options={getStackSelections(DATA_STORE)}
          margin="normal" />
      </div>
      <div>
        <Field
          style={{ minWidth: 120 }}
          name="capacityTotal"
          label="Capacity"
          placeholder="Capacity"
          component={renderTextField}
          type="number"
          InputProps={{ inputProps: { min: 5, max: 200 } }}
          parse={value => Number(value)}
          margin="normal" />
      </div>
      <Button style={{ margin: 8 }} raised type="submit" color="primary" disabled={submitting}>Create</Button>
      <Button style={{ margin: 8 }} raised onClick={cancel}>Cancel</Button>
    </form>
  );
};

CreateDataStoreForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  cancel: PropTypes.func.isRequired,
};

const CreateDataStoreReduxFrom = reduxForm({
  form: 'createDataStore',
  // validate: syncValidate,
  // asyncValidate,
  asyncBlurFields: ['name'],
  destroyOnUnmount: false,
})(CreateDataStoreForm);

// export { CreateDataStoreForm as PureCreateSiteForm };
export default CreateDataStoreReduxFrom;
