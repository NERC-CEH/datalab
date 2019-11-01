import React from 'react';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import MenuItem from '@material-ui/core/MenuItem';
import { fieldStyle, fieldStyleProps, multilineFieldStyleProps } from './controlStyles';
import theme from '../../../theme';
import PrimaryActionButton from '../buttons/PrimaryActionButton';
import SecondaryActionButton from '../buttons/SecondaryActionButton';

export const renderTextField = ({ input, label, meta: { touched, error }, ...custom }) => <TextField
    style={fieldStyle}
    label={label}
    helperText={touched ? error : ''}
    error={error && touched}
    {...input}
    {...custom}
    {...fieldStyleProps}
  />;

export const renderTextArea = ({ input, label, meta: { touched, error }, ...custom }) => <TextField
    style={fieldStyle}
    label={label}
    helperText={touched ? error : ''}
    error={error && touched}
    multiline
    {...input}
    {...custom}
    {...multilineFieldStyleProps}
  />;

export const renderSelectField = ({ input, label, meta: { touched, error }, options, ...custom }) => (
  <TextField
    select // Select component doesn't respect styling so use TextField with select true
    style={fieldStyle}
    label={label}
    onChange={(param, data) => input.onChange(data.value)}
    helperText={touched ? error : ''}
    error={error && touched}
    {...input}
    {...custom}
    {...fieldStyleProps}
  >
    {options.map(({ text, value }, idx) => (<MenuItem key={idx} value={value}>{text}</MenuItem>))}
  </TextField>
);

export const renderAdornedTextField = ({ input, label, meta: { touched, error }, startText, endText, ...custom }) => {
  const InputProps = {
    startAdornment: <InputAdornment position="start">{startText}</InputAdornment>,
    endAdornment: <InputAdornment position="end">{endText}</InputAdornment>,
  };

  return (
    <TextField
      label={label}
      style={fieldStyle}
      InputProps={InputProps}
      onChange={(param, data) => input.onChange(data.value)}
      helperText={touched ? error : ''}
      error={error && touched}
      {...input}
      {...custom}
      {...fieldStyleProps}
    />
  );
};

export const CreateFormControls = ({ onCancel, submitting, fullWidthButtons }) => (
  <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%', margin: `${theme.spacing(2)}px 0` }}>
    <PrimaryActionButton
      type="submit"
      disabled={submitting}
      fullWidth={fullWidthButtons}
    >
      Create
    </PrimaryActionButton>
    <SecondaryActionButton
      style={{ marginLeft: theme.spacing(1) }}
      onClick={onCancel}
      fullWidth={fullWidthButtons}
    >
      Cancel
    </SecondaryActionButton>
  </div>
);
