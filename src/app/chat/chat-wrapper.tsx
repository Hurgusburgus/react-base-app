import * as React from 'react';
import { withStyles, makeStyles, Fab } from '@material-ui/core';
import ChatIcon from '@material-ui/icons/Chat';
import ChatContext from './chat-context';
import ChatWindow from './chat-window';

const useStyles = makeStyles((theme) => ({
  fab: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
  chatBar: {
    position: 'fixed',
    bottom: 0,
    right: 0,
    zIndex: 4321,
  },
  chatBarInner: {
    position: 'relative',
    width: '100%',
    margin: 'auto',
    display: 'flex',
    flexDirection: 'row-reverse',
  },
}));

interface ChatWrapperProps {
  children: React.ReactElement;
}

const ChatWrapper = ({ children }: ChatWrapperProps): React.ReactElement => {
  const classes = useStyles();
  const [chatId, setChatId] = React.useState<string>(null);
  const [showChat, setShowChat] = React.useState(false);

  return (
    <ChatContext.Provider
      value={{ chatId, setChatId, hideChat: () => setShowChat(false) }}
    >
      {showChat ? (
        <div className={classes.chatBar}>
          <div className={classes.chatBarInner}>
            <ChatWindow />
          </div>
        </div>
      ) : (
        <Fab
          aria-label="Chat"
          className={classes.fab}
          color="primary"
          onClick={() => setShowChat(true)}
        >
          <ChatIcon />
        </Fab>
      )}
      {children}
    </ChatContext.Provider>
  );
};

export default ChatWrapper;
