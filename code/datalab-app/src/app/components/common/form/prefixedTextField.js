import React from 'react';
import { Label, Form } from 'semantic-ui-react';
import { labelStyle } from './controlStyles';

const renderPrefixedTextField = ({ input, label, prefix, meta: { touched, error }, ...custom }) => {
  const containingClassName = (touched && error) ? 'error field' : 'field';
  const paddedLabel = { marginLeft: '80px ', ...labelStyle };

  return (
    <Form.Field>
      <div className={containingClassName}>
        <label>URL Name</label>
        <div>
          <span>
            <div className="ui labeled input">
              <div className="ui label">{prefix}</div>
              <input {...input} {...custom} />
            </div>
          </span>
        </div>
        {touched && (error && <Label style={paddedLabel} pointing>{error}</Label>)}
      </div>
    </Form.Field>
  );
};

export default renderPrefixedTextField;
