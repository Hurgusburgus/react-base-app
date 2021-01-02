import * as React from 'react';
import {
  withStyles,
  makeStyles,
  AppBar,
  Toolbar,
  Typography,
  Button,
} from '@material-ui/core';
import { gql, useQuery } from '@apollo/client';
import ProfileMenu from './profile-menu';
import { User } from '../models/models';

const CURRENT_USER = gql`
  query getCurrentUser {
    currentUser @client
  }
`;

const MainSiteHeaderWithData = (): React.ReactElement => {
  const {
    data: { currentUser },
  } = useQuery(CURRENT_USER);
  return <MainSiteHeader currentUser={currentUser} />;
};

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

interface MainSiteHeaderProps {
  currentUser: User;
}

const MainSiteHeader = ({
  currentUser,
}: MainSiteHeaderProps): React.ReactElement => {
  const classes = useStyles();

  return (
    <MainAppBar position="sticky">
      <Toolbar>
        <Typography className={classes.typographyStyles}>
          Gabe Test App
        </Typography>
        <div>
          {currentUser ? (
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

export default MainSiteHeaderWithData;
