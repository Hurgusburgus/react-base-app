import * as React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { UserContext } from './user.context';

interface PrivateRouteProps {
  path: string;
  children: any;
  redirectPath: string;
}

const PrivateRoute = ({
  path,
  children,
  redirectPath,
}: PrivateRouteProps): React.ReactElement => {
  const [userState, actions] = React.useContext(UserContext);
  const { loggedIn } = userState;
  return loggedIn ? (
    <Route path={path}>{children}</Route>
  ) : (
    <Redirect to={redirectPath} />
  );
};

export default PrivateRoute;
