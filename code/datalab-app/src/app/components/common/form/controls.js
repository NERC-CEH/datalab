import React from 'react';
import { Input, TextArea, Dropdown, Form } from 'semantic-ui-react';

export const renderTextField = ({ input, label, meta: { touched, error }, ...custom }) =>
  <Form.Field control={Input} label={label} {...input} {...custom} />;

export const renderTextArea = ({ input, label, meta: { touched, error }, ...custom }) =>
  <Form.Field control={TextArea} label={label} {...input} {...custom} />;

export const renderDropdownField = ({ input, label, meta: { touched, error }, ...custom }) =>
  <Form.Field>
    <label>{label}</label>
    <Dropdown fluid selection {...input} {...custom} value={input.value}
              onChange={ (param, data) => input.onChange(data.value)}/>
  </Form.Field>;
