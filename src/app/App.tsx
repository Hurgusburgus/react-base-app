import * as React from 'react';
import {
  ApolloClient,
  createHttpLink,
  ApolloProvider,
  gql,
  split,
} from '@apollo/client';
import axios from 'axios';
import { onError } from '@apollo/client/link/error';
import { setContext } from '@apollo/client/link/context';
import { WebSocketLink } from '@apollo/client/link/ws';
import { ThemeProvider } from '@material-ui/core/styles';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import styled from 'styled-components';
import { getMainDefinition } from '@apollo/client/utilities';
import { cache, loggedInUserVar } from './cache';
import Header from './header/main-page-header';
import HomePage from './home-page/home.page';
import LoginPage from './profile/login.page';
import SignupPage from './profile/signup.page';
import theme from './theme/theme';
import AuthGuard from './shared/authGuard';
import MyTablesPage from './tables/my-tables.page';
import ChatWrapper from './chat/chat-wrapper';

export const typeDefs = gql`
  extend type Query {
    loggedInUser: AuthPayload
  }
`;

let csrfToken: string;
const getCsrfToken = async (): Promise<string> => {
  if (csrfToken) {
    return csrfToken;
  }
  const { data } = await axios.get('/csrf-token');
  csrfToken = data ? data.csrfToken : null;
  return csrfToken;
};
getCsrfToken();

const httpLink = createHttpLink({
  uri: '/graphql',
  credentials: 'include',
});

const authLink = setContext(async (_, { headers }: any) => {
  return {
    headers: {
      ...headers,
      'X-CSRF-Token': await getCsrfToken(),
    },
  };
});

const redirectLink = onError(({ graphQLErrors, networkError }: any) => {
  if (networkError && networkError.message === 'UNAUTHORIZED') {
    localStorage.removeItem('loggedInUser');
    loggedInUserVar(null);
  }
});

const wsLink = new WebSocketLink({
  uri: `ws://localhost:3000/graphql`,
  options: {
    reconnect: true,
  },
});

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  authLink.concat(httpLink).concat(redirectLink)
);

const client = new ApolloClient({
  cache,
  link: splitLink,
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
                <ChatWrapper>
                  <MyTablesPage />
                </ChatWrapper>
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
