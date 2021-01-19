export interface AuthPayload {
  user: User;
  token: string;
}

export interface User {
  id: string;
  email: string;
  username: string;
}

export interface Table {
  id: string;
  createdBy: User;
  createdOn: string;
  invitees: string[];
  participants: User[];
}
