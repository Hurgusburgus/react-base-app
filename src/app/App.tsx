import * as React from 'react';
import {
  ApolloClient,
  createHttpLink,
  ApolloProvider,
  gql,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { ThemeProvider } from '@material-ui/core/styles';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import styled from 'styled-components';
import { cache } from './cache';
import Header from './header/main-page-header';
import HomePage from './home-page/home.page';
import LoginPage from './profile/login.page';
import SignupPage from './profile/signup.page';
import theme from './theme/theme';
import { AuthPayload } from './models/models';
import AuthGuard from './shared/authGuard';
import MyTablesPage from './tables/my-tables.page';

export const typeDefs = gql`
  extend type Query {
    loggedInUser: AuthPayload
  }
`;

const httpLink = createHttpLink({
  uri: 'http://localhost:3000/graphql',
});

const authLink = setContext((_, { headers }: any) => {
  const { token } = (JSON.parse(localStorage.getItem('loggedInUser')) ||
    {}) as AuthPayload;
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const client = new ApolloClient({
  cache,
  link: authLink.concat(httpLink),
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
            <Route path="/mytables">
              <AuthGuard>
                <MyTablesPage />
              </AuthGuard>
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
