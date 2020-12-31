const login = (username: string, password: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({ username });
    }, 250);
  });
};

const logout = (): Promise<any> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({});
    }, 250);
  });
};

const usernameExists = (username: string): Promise<any> => {
  const result = username === 'username';
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({ result });
    }, 250);
  });
};

const emailExists = (email: string): Promise<any> => {
  const result = email === 'email';
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({ result });
    }, 250);
  });
};

export default { login, logout, usernameExists, emailExists };
