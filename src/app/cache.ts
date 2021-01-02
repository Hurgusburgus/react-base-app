import { InMemoryCache, Reference, makeVar } from '@apollo/client';
import { User } from './models/models';

export const currentUserVar = makeVar<User>(
  JSON.parse(localStorage.getItem('currentUser'))
);

export const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        currentUser: {
          read() {
            return currentUserVar();
          },
        },
      },
    },
  },
});
