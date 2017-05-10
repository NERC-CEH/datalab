import React from 'react';
import { RaisedButton } from 'material-ui';

const style = { margin: 12 };

const ApiExample = ({ count, apiFetching, getCount, incrementCount, resetCount }) => (
  <div>
    <p>
      {`Current count : ${count === null ? 'Unchecked' : count}`}
    </p>
    <span>
      <RaisedButton label="Get Count" primary style={style} onClick={getCount} disabled={apiFetching} />
      <RaisedButton label="Increment Count" primary style={style} onClick={incrementCount} disabled={apiFetching} />
      <RaisedButton label="Reset Count" primary style={style} onClick={resetCount} disabled={apiFetching} />
    </span>
  </div>
);

export default ApiExample;
