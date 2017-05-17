import React from 'react';
import PropTypes from 'prop-types';
import { RaisedButton } from 'material-ui';

const Ping = ({ fetching, value, error, performPing }) => (
  <div>
    <span>
      <RaisedButton label="Ping" secondary onClick={performPing} disabled={fetching} />&nbsp;
      {fetching && <span>Please wait...</span>}
      {value > 0 && <span>Took {value}ms</span>}
      {error && <span>{error.message}</span>}
    </span>
  </div>
);

Ping.propTypes = {
  fetching: PropTypes.bool.isRequired,
  value: PropTypes.number,
  error: PropTypes.number,
  performPing: PropTypes.func.isRequired,
};

Ping.defaultProps = {
  value: null,
  error: null,
};

export default Ping;
