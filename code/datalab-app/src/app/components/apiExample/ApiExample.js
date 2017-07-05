import React from 'react';
import { Button } from 'semantic-ui-react';

const ApiExample = ({ count, apiFetching, getCount, incrementCount, resetCount }) => (
  <div>
    <p>
      {`Current count : ${count === null ? 'Unchecked' : count}`}
    </p>
    <span>
      <Button primary onClick={getCount} disabled={apiFetching}>Get Count</Button>
      <Button primary onClick={incrementCount} disabled={apiFetching}>Increment Count</Button>
      <Button primary onClick={resetCount} disabled={apiFetching}>Reset Count</Button>
    </span>
  </div>
);

export default ApiExample;
