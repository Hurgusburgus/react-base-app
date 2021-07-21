import * as React from 'react';
import { useHistory, Link as RouterLink } from 'react-router-dom';
import { gql, useQuery, useMutation } from '@apollo/client';
import UserContext from './userContext';

const LOGGED_IN_USER = gql`
  query getLoggedInUser {
    loggedInUser @client
  }
`;

interface AuthGuardProps {
  children: React.ReactElement;
}

const AuthGuard = ({ children }: AuthGuardProps): React.ReactElement => {
  const history = useHistory();

  const {
    data: { loggedInUser },
  } = useQuery(LOGGED_IN_USER);

  if (!loggedInUser) {
    history.push('/');
  }
  return (
    <UserContext.Provider value={loggedInUser}>{children}</UserContext.Provider>
  );
};

export default AuthGuard;
