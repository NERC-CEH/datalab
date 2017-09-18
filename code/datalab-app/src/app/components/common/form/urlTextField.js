import React from 'react';
import { Input, Form } from 'semantic-ui-react';

const renderUrlTextField = ({ input, label, meta: { touched, error }, ...custom }) => {
  const name = input.value ? input.value : '<name>';
  const url = `http://datalab-${name}.datalabs.nerc.ac.uk`;

  return (
    <Form.Field>
      <label>{label}</label>
      <Input {...input} {...custom} />{url}
    </Form.Field>
  );
};

export default renderUrlTextField;
