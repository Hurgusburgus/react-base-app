import { InMemoryCache, Reference, makeVar } from '@apollo/client';
import { User } from './models/models';

export const loggedInUserVar = makeVar<User>(
  JSON.parse(localStorage.getItem('loggedInUser'))
);

export const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        loggedInUser: {
          read() {
            return loggedInUserVar();
          },
        },
      },
    },
  },
});
