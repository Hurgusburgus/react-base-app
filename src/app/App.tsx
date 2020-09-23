import * as React from 'react';

export interface HelloWorldProps {
  userName: string;
  lang: string;
}
export const App = ({
  userName,
  lang,
}: HelloWorldProps): React.ReactElement => (
  <h1>{`Hi ${userName} from React! Welcome to ${lang}`}</h1>
);
