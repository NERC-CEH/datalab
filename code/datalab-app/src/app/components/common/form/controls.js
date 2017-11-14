import React from 'react';
import TextField from 'material-ui/TextField';
import Input, { InputLabel, InputAdornment } from 'material-ui/Input';
import Select from 'material-ui/Select';
import { MenuItem } from 'material-ui/Menu';
import { FormControl, FormHelperText } from 'material-ui/Form';

export const renderTextField = ({ input, label, meta: { touched, error }, ...custom }) =>
  <TextField
    label={label}
    helperText={touched ? error : ''}
    error={error && touched}
    {...input}
    {...custom}
  />;

export const renderTextArea = ({ input, label, meta: { touched, error }, ...custom }) =>
  <TextField
    label={label}
    helperText={touched ? error : ''}
    error={error && touched}
    multiline
    {...input}
    {...custom}
  />;

export const renderDropdownField = ({ input, label, meta: { touched, error }, options, margin, ...custom }) =>
  <FormControl error={touched && error} margin={margin}>
    <InputLabel>{label}</InputLabel>
    <Select onChange={(param, data) => input.onChange(data.value)} {...input} {...custom}>
      {options.map(({ text, value }, idx) => (<MenuItem key={idx} value={value}>{text}</MenuItem>))}
    </Select>
    {touched && error && <FormHelperText>{error}</FormHelperText>}
  </FormControl>;

export const renderUrlField = ({ input, label, meta: { touched, error }, startText, endText, margin, ...custom }) =>
  <FormControl error={touched && error} margin={margin}>
    <InputLabel>{label}</InputLabel>
    <Input
      startAdornment={<InputAdornment position="start">{startText}</InputAdornment>}
      endAdornment={<InputAdornment position="end">{endText}</InputAdornment>}
      onChange={(param, data) => input.onChange(data.value)}
      {...input}
      {...custom}
    />
    {touched && error && <FormHelperText>{error}</FormHelperText>}
  </FormControl>;
