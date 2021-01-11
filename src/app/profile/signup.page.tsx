import * as React from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';
import { useHistory, Link as RouterLink } from 'react-router-dom';
import {
  makeStyles,
  Container,
  Avatar,
  Typography,
  TextField,
  Button,
  Grid,
  Link,
} from '@material-ui/core';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import { loggedInUserVar } from '../cache';
import { User } from '../models/models';

const LOGGED_IN_USER = gql`
  query getLoggedInUser {
    loggedInUser @client
  }
`;
export const SIGNUP = gql`
  mutation signup($email: String!, $username: String!, $password: String!) {
    signup(email: $email, username: $username, password: $password) {
      token
      user {
        id
        username
        email
      }
    }
  }
`;

const SignUpPageWithData = (): React.ReactElement => {
  const history = useHistory();

  const {
    data: { loggedInUser },
  } = useQuery(LOGGED_IN_USER);

  const [signup, { loading, error }] = useMutation(SIGNUP, {
    onCompleted({ signup: signupResponse }) {
      if (signupResponse && signupResponse.user) {
        localStorage.setItem('loggedInUser', JSON.stringify(signupResponse));
        loggedInUserVar(signupResponse);
        history.push('/');
      }
    },
  });
  const user = loggedInUser ? loggedInUser.user : null;
  return (
    <SignUpPage
      currentUser={user}
      signup={signup}
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

interface SignUpPageProps {
  currentUser: User;
  signup: (options?: any) => void;
  loading: boolean;
  error: any;
}

const SignUpPage = ({
  currentUser,
  signup,
  loading,
  error,
}: SignUpPageProps): React.ReactElement => {
  const history = useHistory();
  const classes = useStyles();
  const [inputs, setInputs] = React.useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [validations, setValidations] = React.useState({
    emailHelperText: null,
    usernameHelperText: null,
    passwordHelperText: null,
    confirmPasswordHelperText: null,
    valid: false,
  });
  const { email, username, password, confirmPassword } = inputs;
  const {
    emailHelperText,
    usernameHelperText,
    passwordHelperText,
    confirmPasswordHelperText,
    valid,
  } = validations;
  const [submitted, setSubmitted] = React.useState(false);

  if (currentUser) {
    history.push('/');
  }

  const validate = () => {
    let emailValidation = null;
    let usernameValidation = null;
    let passwordValidation = null;
    let confirmPasswordValidation = null;

    const emailValid = /.{1,}@[^.]{1,}/.test(email);
    if (!emailValid && email.length > 0) {
      emailValidation = 'Must be a valid email address';
    }

    const usernameValid = /^(?=.{8,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/.test(
      username
    );
    if (!usernameValid && username.length > 0) {
      usernameValidation =
        'Username must be 8-20 characters, which may only be letters, numbers, underscore(_), or dot(.)';
    }
    const passwordValid = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,20}$/.test(
      password
    );
    if (!passwordValid && password.length > 0) {
      passwordValidation =
        'Passwords must be 8-20 characters, and contain at least one number, one upper case letter, and one lowercase letter.';
    }
    const confirmPasswordValid = password === confirmPassword;
    if (!confirmPasswordValid && confirmPassword.length > 0) {
      confirmPasswordValidation = 'Passwords must match';
    }

    setValidations({
      emailHelperText: emailValidation,
      usernameHelperText: usernameValidation,
      passwordHelperText: passwordValidation,
      confirmPasswordHelperText: confirmPasswordValidation,
      valid:
        emailValid && usernameValid && passwordValid && confirmPasswordValid,
    });
  };

  React.useEffect(() => {
    validate();
  }, [inputs]);

  const handleChange = (e: any): void => {
    const { name, value } = e.target;
    setInputs((prevInputs) => ({ ...prevInputs, [name]: value }));
  };

  const handleSubmit = (e: any): void => {
    e.preventDefault();
    setSubmitted(true);
    if (email && username && password) {
      signup({ variables: { email, username, password } });
    }
  };

  return (
    <Container maxWidth="xs">
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <PersonAddIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Create Your Account
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
            id="email"
            label="Email"
            name="email"
            autoComplete="Enter your email address"
            value={email}
            error={Boolean(emailHelperText)}
            helperText={emailHelperText}
            onChange={handleChange}
            autoFocus
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="Enter your username"
            value={username}
            error={Boolean(usernameHelperText)}
            helperText={usernameHelperText}
            onChange={handleChange}
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
            autoComplete="Enter a password"
            value={password}
            error={Boolean(passwordHelperText)}
            helperText={passwordHelperText}
            onChange={handleChange}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            id="confirmPassword"
            autoComplete="Confirm your password"
            value={confirmPassword}
            error={Boolean(confirmPasswordHelperText)}
            helperText={confirmPasswordHelperText}
            onChange={handleChange}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            disabled={!valid}
            onClick={handleSubmit}
          >
            Sign Up
          </Button>
          <Grid container>
            <Grid item xs />
            <Grid item>
              <Link component={RouterLink} to="/login" variant="body2">
                Already have an account? Login here.
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
};

export default SignUpPageWithData;
