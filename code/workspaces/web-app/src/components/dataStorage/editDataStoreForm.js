import React from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import validate from 'validate.js';
import { renderMultiSelectAutocompleteField, renderTextArea, renderTextField, UpdateFormControls } from '../common/form/controls';
import dataStoreValueConstraints from './dataStoreValueConstraints';

const formPropTypes = {
  onCancel: PropTypes.func.isRequired,
  userList: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.string,
    }),
  ).isRequired,
  usersFetching: PropTypes.bool.isRequired,
};

const EditDataStoreForm = ({
  handleSubmit, reset, pristine, // from redux form
  userList, usersFetching, onCancel, // user provided
}) => (
  <form onSubmit={handleSubmit}>
    <Field
      name="displayName"
      label="Display Name"
      component={renderTextField}
    />
    <Field
      name="description"
      label="Description"
      component={renderTextArea}
    />
    <Field
      name="users"
      label="Users with access to data store"
      placeholder="Type user's email address"
      selectedTip="User has access"
      component={renderMultiSelectAutocompleteField}
      options={userList}
      getOptionLabel={option => option.label}
      getOptionSelected={(option, value) => option.value === value.value}
      loading={usersFetching}
    />
    <UpdateFormControls onClearChanges={reset} onCancel={onCancel} pristine={pristine}/>
  </form>
);

EditDataStoreForm.propTypes = {
  ...formPropTypes,
  handleSubmit: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
};

const EditDataStoreReduxForm = reduxForm({
  form: 'editDataStoreDetails',
  enableReinitialize: true, // update form state when users have loaded
  validate: values => validate(values, dataStoreValueConstraints, { format: 'reduxForm' }),
})(EditDataStoreForm);

EditDataStoreReduxForm.propTypes = {
  ...formPropTypes,
  onSubmit: PropTypes.func.isRequired,
  initialValues: PropTypes.shape({
    displayName: PropTypes.string,
    description: PropTypes.string,
    users: formPropTypes.userList,
  }),
};

export { EditDataStoreForm as PureEditDataStoreForm };

export default EditDataStoreReduxForm;
