import { InMemoryCache, Reference, makeVar } from '@apollo/client';
import { AuthPayload } from './models/models';

export const loggedInUserVar = makeVar<AuthPayload>(
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
