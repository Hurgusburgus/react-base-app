import * as React from 'react';
import userService from '../services/user.service';

interface UserContextProviderProps {
  children: any;
}

const currentUser = JSON.parse(localStorage.getItem('user'));
const initialUserState = currentUser
  ? { loggedIn: true, user: currentUser }
  : {};

const userReducer = (state: any, action: any) => {
  switch (action.type) {
    case 'LOGIN_REQUEST':
      return {
        loggingIn: true,
        user: action.user,
      };
    case 'LOGIN_SUCCESS':
      localStorage.setItem('user', JSON.stringify(action.user));
      return {
        loggedIn: true,
        user: action.user,
      };
    case 'LOGIN_FAILURE':
    case 'LOGOUT':
      localStorage.removeItem('user');
      return {};
    default:
      return state;
  }
};

export const UserContext = React.createContext([]);

export const UserContextProvider = ({
  children,
}: UserContextProviderProps): React.ReactElement => {
  const [userState, dispatch] = React.useReducer(userReducer, initialUserState);

  const login = async (username: string, password: string) => {
    dispatch({ type: 'LOGIN_REQUEST', user: { username } });
    userService.login(username, password).then(
      (user) => dispatch({ type: 'LOGIN_SUCCESS', user }),
      (error) => dispatch({ type: 'LOGIN_FAILURE', error: error.toString() })
    );
  };

  const logout = () => {
    userService.logout();
    dispatch({ type: 'LOGOUT' });
  };

  const actions = { login, logout };

  return (
    <UserContext.Provider value={[userState, actions]}>
      {children}
    </UserContext.Provider>
  );
};
