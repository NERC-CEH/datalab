import {
  GraphQLID,
  GraphQLObjectType,
  GraphQLString,
  GraphQLBoolean,
  GraphQLEnumType,
  GraphQLInputObjectType,
} from 'graphql';
import stackUrlService from '../dataaccess/stackUrlService';
import { getStackTypes } from '../../shared/stackTypes';
import { getStatusTypes } from '../../shared/statusTypes';

const statusType = new GraphQLEnumType({
  name: 'StatusType',
  description: 'Status classes within DataLabs',
  values: getStatusTypes(),
});

export const StackType = new GraphQLObjectType({
  name: 'Stack',
  description: 'Type to represent online Stacks',
  fields: {
    id: {
      type: GraphQLID,
    },
    name: {
      type: GraphQLString,
    },
    displayName: {
      type: GraphQLString,
    },
    description: {
      type: GraphQLString,
    },
    type: {
      type: GraphQLString,
    },
    url: {
      type: GraphQLString,
    },
    internalEndpoint: {
      type: GraphQLString,
    },
    sourcePath: {
      type: GraphQLString,
    },
    isPublic: {
      type: GraphQLBoolean,
    },
    redirectUrl: {
      type: GraphQLString,
      resolve: (obj, args, { user }) => stackUrlService(obj, user),
    },
    volumeMount: {
      type: GraphQLString,
    },
    status: {
      type: statusType,
    },
  },
});

export const StackTypeEnum = new GraphQLEnumType({
  name: 'StackType',
  description: 'Stack types within DataLabs',
  values: getStackTypes(),
});

export const StackCreationType = new GraphQLInputObjectType({
  name: 'StackCreationRequest',
  description: 'Type to describe the mutation for creating a new Stack.',
  fields: {
    displayName: {
      type: GraphQLString,
    },
    name: {
      type: GraphQLString,
    },
    type: {
      type: StackTypeEnum,
    },
    description: {
      type: GraphQLString,
    },
    sourcePath: {
      type: GraphQLString,
    },
    isPublic: {
      type: GraphQLBoolean,
    },
    volumeMount: {
      type: GraphQLString,
    },
  },
});

export const StackDeletionType = new GraphQLInputObjectType({
  name: 'StackDeletionRequest',
  description: 'Type to describe the mutation for deleting a new Stack.',
  fields: {
    name: {
      type: GraphQLString,
    },
    type: {
      type: StackTypeEnum,
    },
  },
});
