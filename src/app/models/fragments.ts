import { gql } from '@apollo/client';

export const USER_FRAGMENT = gql`
  fragment UserFragment on User {
    id
    username
  }
`;

export const TABLE_FRAGMENT = gql`
  fragment TableFragment on Table {
    id
    createdBy {
      ...UserFragment
    }
    createdOn
    invitees
    participants {
      ...UserFragment
    }
  }
  ${USER_FRAGMENT}
`;
