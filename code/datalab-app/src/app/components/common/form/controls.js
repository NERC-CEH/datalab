import React from 'react';
import { Input, Dropdown, Form, Label } from 'semantic-ui-react';
import { fieldStyle, labelStyle } from './controlStyles';

export const renderTextField = ({ input, label, meta: { touched, error }, ...custom }) =>
  <Form.Field error={error && touched}>
    <label>{label}</label>
    <Input type='text' style={fieldStyle} {...input} {...custom}/>
    {touched && (error && <Label style={labelStyle} pointing>{error}</Label>)}
  </Form.Field>;

export const renderTextArea = ({ input, label, meta: { touched, error }, ...custom }) =>
  <Form.Field error={error && touched}>
    <label>{label}</label>
    <textarea style={fieldStyle} {...input} {...custom}/>
    {touched && (error && <Label style={labelStyle} pointing>{error}</Label>)}
  </Form.Field>;

export const renderDropdownField = ({ input, label, meta: { touched, error }, ...custom }) =>
  <Form.Field error={error && touched}>
    <label>{label}</label>
    <Dropdown fluid selection {...input} {...custom} value={input.value}
              onChange={ (param, data) => input.onChange(data.value)}/>
    {touched && (error && <Label style={labelStyle} pointing>{error}</Label>)}
  </Form.Field>;
