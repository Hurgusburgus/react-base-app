import { gql } from '@apollo/client';

export const USER_FRAGMENT = gql`
  fragment UserFragment on User {
    id
    username
  }
`;

export const GAME_INFO_FRAGMENT = gql`
  fragment GameInfoFragment on GameInfo {
    id
    name
  }
`;

export const TABLE_FRAGMENT = gql`
  fragment TableFragment on Table {
    id
    gameInfo {
      ...GameInfoFragment
    }
    createdBy {
      ...UserFragment
    }
    createdOn
    invitees {
      ...UserFragment
    }
    participants {
      ...UserFragment
    }
  }
  ${GAME_INFO_FRAGMENT}
  ${USER_FRAGMENT}
`;

export const COMMENT_FRAGMENT = gql`
  fragment CommentFragment on Comment {
    timestamp
    author {
      ...UserFragment
    }
    content
  }
  ${USER_FRAGMENT}
`;

export const CHAT_FRAGMENT = gql`
  fragment ChatFragment on Chat {
    id
    tableId
    comments {
      ...CommentFragment
    }
  }
  ${COMMENT_FRAGMENT}
`;
