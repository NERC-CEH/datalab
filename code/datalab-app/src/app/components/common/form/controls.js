import React from 'react';
import TextField from '@material-ui/core/TextField';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import { fieldStyle, fieldMargin } from './controlStyles';

export const renderTextField = ({ input, label, meta: { touched, error }, ...custom }) =>
  <TextField
    style={fieldStyle}
    margin={fieldMargin}
    label={label}
    helperText={touched ? error : ''}
    error={error && touched}
    {...input}
    {...custom}
  />;

export const renderTextArea = ({ input, label, meta: { touched, error }, ...custom }) =>
  <TextField
    style={fieldStyle}
    margin={fieldMargin}
    label={label}
    helperText={touched ? error : ''}
    error={error && touched}
    multiline
    {...input}
    {...custom}
  />;

export const renderSelectField = ({ input, label, meta: { touched, error }, options, ...custom }) =>
  <FormControl error={touched && error} margin={fieldMargin}>
    <InputLabel>{label}</InputLabel>
    <Select
      style={fieldStyle}
      onChange={(param, data) => input.onChange(data.value)}
      {...input}
      {...custom}
    >
      {options.map(({ text, value }, idx) => (<MenuItem key={idx} value={value}>{text}</MenuItem>))}
    </Select>
    {touched && error && <FormHelperText>{error}</FormHelperText>}
  </FormControl>;

export const renderAdornedTextField = ({ input, label, meta: { touched, error }, startText, endText, ...custom }) =>
  <FormControl error={touched && error} margin={fieldMargin}>
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
