import React from 'react';
import Counter from './Counter';
import Ping from './Ping';

const Examples = ({ counterValue, incrementCounter, ping, performPing }) => (
  <div>
    <Counter value={counterValue} increment={incrementCounter} />
    <br />
    <Ping {...ping} performPing={performPing} />
  </div>
);

export default Examples;
