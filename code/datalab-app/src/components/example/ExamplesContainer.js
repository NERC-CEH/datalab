import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import counterActions from '../../actions/counterActions';
import pingActions from '../../actions/pingActions';
import Examples from './Examples';

const ExamplesContainer = ({ counterValue, ping, actions: { incrementCounter, performPing } }) => (
  <Examples counterValue={counterValue} incrementCounter={incrementCounter} ping={ping} performPing={performPing} />
);

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
