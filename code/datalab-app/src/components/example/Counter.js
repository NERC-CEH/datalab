import React from 'react';
import PropTypes from 'prop-types';
import { RaisedButton } from 'material-ui';

const Counter = ({ value, increment }) => (
  <div>
    <RaisedButton label={value || 'Click Counter'} primary onClick={increment} />
  </div>
);

Counter.propTypes = {
  value: PropTypes.number,
  increment: PropTypes.func.isRequired,
};

Counter.defaultProps = {
  value: null,
};

export default Counter;
