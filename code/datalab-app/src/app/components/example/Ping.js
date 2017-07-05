import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react';

const Ping = ({ fetching, value, error, performPing }) => (
  <div>
    <span>
      <Button secondary onClick={performPing} disabled={fetching}>Ping</Button>&nbsp;
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
