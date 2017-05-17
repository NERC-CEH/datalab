import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import apiExampleActions from '../../actions/graphQLActions';
import ApiExample from './ApiExample';

const ApiExampleContainer = ({ apiCount, apiFetching, actions: { getCount, incrementCount, resetCount } }) => (
  <ApiExample count={apiCount} getCount={getCount} incrementCount={incrementCount} resetCount={resetCount} />
);

function mapStateToProps({ graphQL }) {
  return {
    apiCount: graphQL.value,
    apiFetching: graphQL.fetching,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...apiExampleActions }, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ApiExampleContainer);
