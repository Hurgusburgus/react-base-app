export interface User {
  id: string;
  email: string;
  username: string;
}

export enum TableAccess {
  PUBLIC = 'public',
  FRIENDS = 'friends',
  INVITE = 'invite',
}

export interface Table {
  id: string;
  gameInfo: GameInfo;
  access: TableAccess;
  createdBy: User;
  createdOn: string;
  invitees: User[];
  participants: User[];
}

export interface GameInfo {
  id: string;
  name: string;
}

export interface Comment {
  id: string;
  timestamp: string;
  author: User;
  content: string;
}

export interface Chat {
  id: string;
  tableId: string;
  participants: User[];
  comments: Comment[];
}
