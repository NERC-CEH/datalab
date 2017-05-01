import React from 'react';
import { RaisedButton } from 'material-ui';

const Ping = ({ fetching, value, error, performPing }) => (
  <div>
    <span>
      <RaisedButton label="Ping" secondary={true} onClick={performPing} disabled={fetching} />&nbsp;
      {fetching && <span>Please wait...</span>}
      {value > 0 && <span>Took {value}ms</span>}
      {error && <span>{error.message}</span>}
    </span>
  </div>
);

export default Ping;
