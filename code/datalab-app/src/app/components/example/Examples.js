import React from 'react';
import PropTypes from 'prop-types';
import Counter from './Counter';
import Ping from './Ping';

const Examples = ({ counterValue, incrementCounter, ping, performPing }) => (
  <div>
    <Counter value={counterValue} increment={incrementCounter} />
    <br />
    <Ping {...ping} performPing={performPing} />
  </div>
);

Examples.propTypes = {
  counterValue: PropTypes.number,
  incrementCounter: PropTypes.func.isRequired,
  ping: PropTypes.object,
  performPing: PropTypes.func.isRequired,
};

Examples.defaultProps = {
  counterValue: null,
  ping: null,
};

export default Examples;
