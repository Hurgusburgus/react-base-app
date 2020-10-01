import * as React from 'react';
import styled from 'styled-components';
import { UserContext } from '../shared/user.context';
import LoginForm from './login-form';

const Header = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: space-between;
  align-items: baseline;
  background-color: #ccc;
  padding: 1rem;
`;

const Title = styled.div`
  font-size: 1.5rem;
`;

const Username = styled.strong`
  color: blue;
`;

export const HeaderElement = styled.div`
  margin: 0.5rem 2rem;
`;

const MainSiteHeader = (): React.ReactElement => {
  const [userState, actions] = React.useContext(UserContext);
  const { user, loggedIn } = userState;
  const { logout } = actions;

  return (
    <Header>
      <Title>Gabe Test Site</Title>
      <div>
        {loggedIn ? (
          <>
            <span>
              {'Logged in as '}
              <Username>{user.username}</Username>
            </span>
            <button type="button" onClick={logout}>
              <span>Logout</span>
            </button>
          </>
        ) : (
          <LoginForm />
        )}
      </div>
    </Header>
  );
};

export default MainSiteHeader;
