import * as React from 'react';
import { UserContext } from '../shared/user.context';

const HomePage = (): React.ReactElement => {
  const [userState, actions] = React.useContext(UserContext);
  const { user, loggedIn } = userState;
  if (loggedIn) {
    return <div>{`Welcome ${user ? user.username : 'ERROR'}`}</div>;
  }
  return <div>Welcome. Please log in</div>;
};

export default HomePage;
