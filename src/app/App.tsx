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
import PrivateRoute from './shared/private-route';
import { UserContextProvider } from './shared/user.context';
import Header from './header/main-page-header';
import HomePage from './home-page/home.page';
import LoginPage from './profile/login.page';
import SignupPage from './profile/signup.page';
import theme from './theme/theme';

const client = new ApolloClient({
  uri: 'http://localhost:3000/graphql',
  cache: new InMemoryCache(),
});

const AppWrapper = styled.div`
  font-family: Helvetica Neue, Helvetica, Arial, sans-serif;
`;

const App = (): React.ReactElement => (
  <ThemeProvider theme={theme}>
    <ApolloProvider client={client}>
      <UserContextProvider>
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
      </UserContextProvider>
    </ApolloProvider>
  </ThemeProvider>
);

export default App;
