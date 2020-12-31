import * as React from 'react';
import {
  withStyles,
  makeStyles,
  AppBar,
  Toolbar,
  Typography,
  Button,
} from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { UserContext } from '../shared/user.context';
import ProfileMenu from './profile-menu';

const useStyles = makeStyles((theme) => ({
  typographyStyles: {
    flex: 1,
    color: 'white',
  },
  buttonContainer: {
    flex: 1,
  },
  headerButton: {
    margin: theme.spacing(1),
  },
}));

const MainAppBar = withStyles({
  root: {
    background: 'linear-gradient(45deg, #53afd4 30%, #1d4c5e 90%)',
  },
})(AppBar);

const LoginButton = withStyles({
  root: {
    color: 'white',
  },
})(Button);

const MainSiteHeader = (): React.ReactElement => {
  const classes = useStyles();
  const [userState, actions] = React.useContext(UserContext);
  const { loggedIn } = userState;
  const history = useHistory();

  return (
    <MainAppBar position="sticky">
      <Toolbar>
        <Typography className={classes.typographyStyles}>
          Gabe Test App
        </Typography>
        <div>
          {loggedIn ? (
            <ProfileMenu />
          ) : (
            <div className={classes.buttonContainer}>
              <LoginButton
                className={classes.headerButton}
                variant="contained"
                color="primary"
                href="/login"
              >
                Login
              </LoginButton>
              <LoginButton
                className={classes.headerButton}
                variant="contained"
                color="secondary"
                href="/signup"
              >
                Sign Up
              </LoginButton>
            </div>
          )}
        </div>
      </Toolbar>
    </MainAppBar>
  );
};

export default MainSiteHeader;
