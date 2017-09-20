import ApolloClient, { createNetworkInterface } from 'apollo-client';
import gql from 'graphql-tag';
import auth from '../auth/auth';
import apiBase from './apiBase';

const apiURL = `${apiBase}/api`;
const networkInterface = createNetworkInterface({ uri: apiURL });

networkInterface.use([{
  applyMiddleware(req, next) {
    if (!req.options.headers) {
      req.options.headers = {};  // Create the header object if needed.
    }

    req.options.headers.Authorization = `Bearer ${auth.getCurrentSession().accessToken}`;
    next();
  },
}]);

export const client = new ApolloClient({ networkInterface, connectToDevTools: true });

export const gqlQuery = (query, variables) => client.query({ query: gql`query ${query}`, variables, fetchPolicy: 'network-only' });

export const gqlMutation = (mutation, variables) => client.mutate({ mutation: gql`mutation ${mutation}`, variables });
