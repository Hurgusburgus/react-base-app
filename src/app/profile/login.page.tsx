import * as React from 'react';
import { useHistory, Link as RouterLink } from 'react-router-dom';
import {
  makeStyles,
  Container,
  Avatar,
  Typography,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  Grid,
  Link,
} from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import { gql, useQuery, useMutation } from '@apollo/client';

import { loggedInUserVar } from '../cache';
import { User } from '../models/models';

const LOGGED_IN_USER = gql`
  query getLoggedInUser {
    loggedInUser @client
  }
`;

export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      id
      username
      email
    }
  }
`;

const LoginPageWithData = (): React.ReactElement => {
  const history = useHistory();

  const {
    data: { loggedInUser },
  } = useQuery(LOGGED_IN_USER);

  const [login, { loading, error }] = useMutation(LOGIN, {
    onCompleted({ login: loginResponse }) {
      if (loginResponse) {
        localStorage.setItem('loggedInUser', JSON.stringify(loginResponse));
        loggedInUserVar(loginResponse);
        history.push('/');
      }
    },
  });
  const user = loggedInUser ? loggedInUser.user : null;
  return (
    <LoginPage
      currentUser={user}
      login={login}
      loading={loading}
      error={error}
    />
  );
};

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  alert: {
    padding: theme.spacing(1),
    backgroundColor: '#fdecea',
    borderRadius: '5px',
    display: 'flex',
    alignItems: 'center',
  },
  alertText: {
    marginLeft: theme.spacing(1),
  },
}));

interface LoginPageProps {
  currentUser: User;
  login: (options?: any) => void;
  loading: boolean;
  error: any;
}

const LoginPage = ({
  currentUser,
  login,
  loading,
  error,
}: LoginPageProps): React.ReactElement => {
  const classes = useStyles();
  const history = useHistory();
  const [inputs, setInputs] = React.useState({
    username: '',
    password: '',
  });
  const { username, password } = inputs;
  const [submitted, setSubmitted] = React.useState(false);

  if (currentUser) {
    history.push('/');
  }

  const handleChange = (e: any): void => {
    const { name, value } = e.target;
    setInputs((prevInputs) => ({ ...prevInputs, [name]: value }));
  };

  const handleSubmit = (e: any): void => {
    e.preventDefault();
    setSubmitted(true);
    if (username && password) {
      login({ variables: { username, password } });
    }
  };

  return (
    <Container maxWidth="xs">
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign In
        </Typography>
        <form className={classes.form} noValidate>
          {error ? (
            <div className={classes.alert}>
              <ErrorOutlineIcon style={{ color: 'red' }} />
              <span className={classes.alertText}>{error.message}</span>
            </div>
          ) : null}
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            value={username}
            onChange={handleChange}
            autoFocus
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={handleChange}
          />
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={handleSubmit}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              <Link component={RouterLink} to="/" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link component={RouterLink} to="/signup" variant="body2">
                Don&apos;t have an account? Sign Up
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
};

export default LoginPageWithData;
