import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import counterActions from '../../actions/counterActions';
import pingActions from '../../actions/pingActions';
import Examples from './Examples';

const ExamplesContainer = ({ counterValue, ping, actions: { incrementCounter, performPing } }) => (
  <Examples counterValue={counterValue} incrementCounter={incrementCounter} ping={ping} performPing={performPing} />
);

ExamplesContainer.propTypes = {
  counterValue: PropTypes.number,
  ping: PropTypes.number,
  actions: PropTypes.shape({
    incrementCounter: PropTypes.func.isRequired,
    performPing: PropTypes.func.isRequired,
  }).isRequired,
};

ExamplesContainer.defaultProps = {
  counterValue: null,
  ping: null,
};

function mapStateToProps({ counter, ping }) {
  return {
    counterValue: counter.value,
    ping,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...counterActions, ...pingActions }, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ExamplesContainer);
