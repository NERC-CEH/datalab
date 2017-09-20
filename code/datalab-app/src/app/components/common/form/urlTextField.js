import React from 'react';
import { Label, Input, Form } from 'semantic-ui-react';
import { labelStyle } from './controlStyles';

const renderUrlTextField = ({ input, label, meta: { touched, error }, ...custom }) => {
  const containingClassName = (touched && error) ? 'error field' : 'field';
  const urlStyle = { display: 'inline-block', paddingTop: '7px', paddingRight: '4px', color: 'grey' };
  const leadStyle = { paddingRight: '4px', ...urlStyle };
  const trailStyle = { paddingLeft: '4px', ...urlStyle };
  const inputStyle = { width: '230px', display: 'inline' };
  const paddedLabel = { marginLeft: '80px ', ...labelStyle };

  return (
    <Form.Field>
      <div className={containingClassName}>
        <label>URL Name</label>
        <div>
          <span style={leadStyle}>http://datalab-</span>
          <span>
            <Input style={inputStyle} {...input} {...custom} error={error && touched}/>
          </span>
          <span style={trailStyle}>.datalabs.nerc.ac.uk</span>
        </div>
        {touched && (error && <Label style={paddedLabel} pointing>{error}</Label>)}
      </div>
    </Form.Field>
  );
};

export default renderUrlTextField;
