import { GraphQLString } from 'graphql';
import version from '../version';

const status = {
  description: 'Status string to confirm GraphQL server is running.',
  type: GraphQLString,
  resolve: () => `GraphQL server is ${version ? `running version ${version}` : 'is alive!'}`,
};

export default status;
