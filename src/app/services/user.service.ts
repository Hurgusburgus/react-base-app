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

export default { login, logout };
