import * as React from 'react';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  gql,
} from '@apollo/client';

const client = new ApolloClient({
  uri: 'https://48p1r2roz4.sse.codesandbox.io',
  cache: new InMemoryCache(),
});

const App = (): React.ReactElement => (
  <ApolloProvider client={client}>
    <h1> Hi from React! Welcome </h1>
  </ApolloProvider>
);

export default App;
