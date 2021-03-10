import { Field, reduxForm } from 'redux-form';
import PropTypes from 'prop-types';
import React from 'react';
import { CreateFormControls, renderSelectField, renderTextField } from '../common/form/controls';
import { useReduxFormValue } from '../../hooks/reduxFormHooks';
import { syncValidate } from './createClusterValidator';

const commonFieldProps = {
  component: renderTextField,
  InputLabelProps: { shrink: true },
};

const createHelperText = ({ lowerLimit, default: defaultValue, upperLimit }) => (
  `Value range: min=${lowerLimit} max=${upperLimit} default=${defaultValue}`
);

const noneOption = { text: 'None', value: '--none--' };
export const removeNoneOptions = values => Object.entries(values).reduce(
  (filtered, [key, value]) => {
    if (value !== noneOption.value) return { ...filtered, [key]: value };
    return filtered;
  },
  {},
);

export const CreateClusterFormContent = ({
  handleSubmit, form: formName, onSubmit, cancel, submitting, dataStorageOptions, clusterMaxWorkers, workerMaxMemory, workerMaxCpu,
}) => {
  const VOLUME_MOUNT_FIELD_NAME = 'volumeMount';
  const volumeMountValue = useReduxFormValue(formName, VOLUME_MOUNT_FIELD_NAME);

  return (
    <form onSubmit={handleSubmit(values => onSubmit(removeNoneOptions(values)))}>
      <Field
        {...commonFieldProps}
        name="displayName"
        label="Display Name"
      />
      <Field
        {...commonFieldProps}
        name="name"
        label="Internal Name"
      />
      <Field
        {...commonFieldProps}
        name={VOLUME_MOUNT_FIELD_NAME}
        label="Data Store to Mount"
        component={renderSelectField}
        options={[noneOption, ...dataStorageOptions]}
      />
      {volumeMountValue && volumeMountValue !== noneOption.value
        && <Field
          {...commonFieldProps}
          name="condaPath"
          label="Path to Conda environment (optional)"
          helperText="The file path to the conda environment on the selected Data Store to be used by the workers."
        />
      }
      <Field
        {...commonFieldProps}
        name="maxWorkers"
        label="Maximum number of workers"
        type="number"
        InputProps={{
          inputProps: {
            min: clusterMaxWorkers.lowerLimit,
            max: clusterMaxWorkers.upperLimit,
            step: 1,
          },
        }}
        parse={value => Number(value)}
        helperText={createHelperText(clusterMaxWorkers)}
      />
      <Field
        {...commonFieldProps}
        name="maxWorkerMemoryGb"
        label="Maximum worker memory (GB)"
        type="number"
        InputProps={{
          inputProps: {
            min: workerMaxMemory.lowerLimit,
            max: workerMaxMemory.upperLimit,
            step: 0.5,
          },
        }}
        parse={value => Number(value)}
        helperText={createHelperText(workerMaxMemory)}
      />
      <Field
        {...commonFieldProps}
        name="maxWorkerCpu"
        label="Maximum worker CPU use"
        type="number"
        InputProps={{
          inputProps: {
            min: workerMaxCpu.lowerLimit,
            max: workerMaxCpu.upperLimit,
            step: 0.5,
          },
        }}
        parse={value => Number(value)}
        helperText={createHelperText(workerMaxCpu)}
      />
      <CreateFormControls onCancel={cancel} submitting={submitting}/>
    </form>
  );
};

const CreateClusterReduxForm = reduxForm({
  validate: syncValidate,
  destroyOnUnmount: false,
  enableReinitialize: true,
})(CreateClusterFormContent);

const CreateClusterForm = ({ formName, ...otherProps }) => <CreateClusterReduxForm form={formName} {...otherProps} />;

export { CreateClusterFormContent as PureCreateClusterForm };
export default CreateClusterForm;

const dropDownOptionType = PropTypes.shape({
  text: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
});

const dropDownOptionArrayType = PropTypes.arrayOf(dropDownOptionType);

const inputConstraintPropTypes = PropTypes.shape({
  lowerLimit: PropTypes.number.isRequired,
  upperLimit: PropTypes.number.isRequired,
  default: PropTypes.number.isRequired,
});

CreateClusterForm.propTypes = {
  formName: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  cancel: PropTypes.func.isRequired,
  dataStorageOptions: dropDownOptionArrayType.isRequired,
  clusterMaxWorkers: inputConstraintPropTypes.isRequired,
  workerMaxMemory: inputConstraintPropTypes.isRequired,
  workerMaxCpu: inputConstraintPropTypes.isRequired,
};
