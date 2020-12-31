import * as React from 'react';
import styled from 'styled-components';
import { UserContext } from '../shared/user.context';

const padding = `margin-right: 0.5rem;`;

const PaddedLabel = styled.label`
  ${padding}
`;

const PaddedButton = styled.button`
  ${padding}
`;

const LoginForm = (): React.ReactElement => {
  const [inputs, setInputs] = React.useState({
    username: '',
    password: '',
  });
  const { username, password } = inputs;
  const [submitted, setSubmitted] = React.useState(false);
  const [userState, userActions] = React.useContext(UserContext);
  const { loggingIn } = userState;

  if (loggingIn) {
    return <div>Logging In...</div>;
  }

  const handleChange = (e: any): void => {
    const { name, value } = e.target;
    setInputs((prevInputs) => ({ ...prevInputs, [name]: value }));
  };

  const handleSubmit = (e: any): void => {
    e.preventDefault();
    setSubmitted(true);
    if (username && password) {
      userActions.login(username, password);
    }
  };

  return (
    <form name="form" onSubmit={handleSubmit}>
      <span className="form-group">
        <PaddedLabel htmlFor="username-input">
          Username:
          <input
            id="username-input"
            type="text"
            name="username"
            value={username}
            onChange={handleChange}
            className={`form-control${
              submitted && !username ? ' is-invalid' : ''
            }`}
          />
        </PaddedLabel>
        {submitted && !username && (
          <div className="invalid-feedback">Username is required</div>
        )}
      </span>
      <span className="form-group">
        <PaddedLabel htmlFor="password-input">
          Password:
          <input
            id="password-input"
            type="password"
            name="password"
            value={password}
            onChange={handleChange}
            className={`form-control${
              submitted && !password ? ' is-invalid' : ''
            }`}
          />
        </PaddedLabel>
        {submitted && !password && (
          <div className="invalid-feedback">Password is required</div>
        )}
      </span>
      {}
      <span className="form-group">
        <PaddedButton type="submit">
          <span>Submit</span>
        </PaddedButton>
        <PaddedButton type="button">
          <span>Register</span>
        </PaddedButton>
      </span>
    </form>
  );
};

export default LoginForm;
