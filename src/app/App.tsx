import * as React from 'react';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  gql,
} from '@apollo/client';
import { ThemeProvider } from '@material-ui/core/styles';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import styled from 'styled-components';
import { cache } from './cache';
import Header from './header/main-page-header';
import HomePage from './home-page/home.page';
import LoginPage from './profile/login.page';
import SignupPage from './profile/signup.page';
import theme from './theme/theme';

export const typeDefs = gql`
  extend type Query {
    currentUser: User
  }
`;

const client = new ApolloClient({
  cache,
  uri: 'http://localhost:3000/graphql',
  typeDefs,
});

const AppWrapper = styled.div`
  font-family: Helvetica Neue, Helvetica, Arial, sans-serif;
`;

const App = (): React.ReactElement => (
  <ThemeProvider theme={theme}>
    <ApolloProvider client={client}>
      <AppWrapper>
        <Header />
        <Router>
          <Switch>
            <Route path="/login">
              <LoginPage />
            </Route>
            <Route path="/signup">
              <SignupPage />
            </Route>
            <Route path="/" exact>
              <HomePage />
            </Route>
          </Switch>
        </Router>
      </AppWrapper>
    </ApolloProvider>
  </ThemeProvider>
);

export default App;
