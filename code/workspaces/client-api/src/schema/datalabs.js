import {
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import datalabRepository from '../dataaccess/datalabRepository';

const DatalabType = new GraphQLObjectType({
  name: 'Datalab',
  description: 'DataLabs type for basic datalab information.',
  fields: {
    name: {
      type: GraphQLString,
    },
    domain: {
      type: GraphQLString,
    },
  },
});

export const datalabs = {
  description: 'List of DataLabs.',
  type: new GraphQLList(DatalabType),
  resolve: (obj, args, { user }) => datalabRepository.getAll(user),
};

export const datalab = {
  description: 'Details for a single Datalab.',
  type: DatalabType,
  args: {
    name: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  resolve: (obj, { name }, { user }) => datalabRepository.getByName(user, name),
};
