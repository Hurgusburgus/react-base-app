import * as React from 'react';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  gql,
} from '@apollo/client';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import styled from 'styled-components';
import PrivateRoute from './shared/private-route';
import { UserContextProvider } from './shared/user.context';
import Header from './header/main-page-header';
import HomePage from './home-page/home.page';

const client = new ApolloClient({
  uri: 'http://localhost:3000/graphql',
  cache: new InMemoryCache(),
});

const AppWrapper = styled.div`
  font-family: Helvetica Neue, Helvetica, Arial, sans-serif;
`;

const App = (): React.ReactElement => (
  <ApolloProvider client={client}>
    <UserContextProvider>
      <AppWrapper>
        <Header />
        <Router>
          <Switch>
            <Route path="/">
              <HomePage />
            </Route>
          </Switch>
        </Router>
      </AppWrapper>
    </UserContextProvider>
  </ApolloProvider>
);

export default App;
