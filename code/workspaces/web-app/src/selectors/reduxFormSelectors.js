const selectReduxFormValue = (formName, fieldName) => (state) => {
  const formData = state.form[formName];
  return formData && formData.values && formData.values[fieldName];
};

export default {
  reduxFormValue: selectReduxFormValue,
};
