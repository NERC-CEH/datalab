import { GraphQLString } from 'graphql';
import { version } from '../version';

const status = {
  description: 'Status string to confirm GraphQL server is running.',
  type: GraphQLString,
  resolve: () => `GraphQL server is running version: ${version}`,
};

export default status;
