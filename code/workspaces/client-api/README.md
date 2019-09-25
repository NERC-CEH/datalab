# Client API GraphQL Service

## Mock Implementation

Using the GraphQL schema it is possible to run a mock service in place of the real client-api service. To start the
mock server run `yarn mock`.

The current implementation is very basic using canned responses that match the data types but do not intelligently
supply data to the front end. It is possible to override this default mocking behaviour by passing resolvers to use
in place of the default resolvers. This is configured in the following line in the `mockServer.js` file.

```javascript
const schema = makeExecutableSchema({ typeDefs, resolvers: mockResolvers });
```

These mock resolvers can then either be statically configured to return specific responses or more likely configured
to return a number of different canned responses to allow different UI functionality to be exercised.

Further documentation can be found on the [Apollo GraphQL](https://www.apollographql.com/docs/graphql-tools/mocking/)
website.
