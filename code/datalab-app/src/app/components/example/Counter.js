import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react';

const Counter = ({ value, increment }) => (
  <div>
    <Button primary onClick={increment}>{value || 'Click Counter'}</Button>
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
