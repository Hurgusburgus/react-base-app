import * as React from 'react';
import {
  makeStyles,
  Container,
  CssBaseline,
  Paper,
  Grid,
  AppBar,
  Toolbar,
  TextField,
  IconButton,
} from '@material-ui/core';
import SendIcon from '@material-ui/icons/Send';
import { gql, useQuery, useMutation } from '@apollo/client';
import { useParams } from 'react-router-dom';
import { User, Chat } from '../models/models';
import { CHAT_FRAGMENT, COMMENT_FRAGMENT } from '../models/fragments';
import ChatEntry from './chat-entry';
import ChatContext from './chat-context';

const CHAT_SUBSCRIPTION = gql`
  subscription OnCommentPosted($chatId: ID!) {
    commentPosted(chatId: $chatId) {
      ...CommentFragment
    }
  }
  ${COMMENT_FRAGMENT}
`;

const GET_CHAT = gql`
  query getChat($id: ID!) {
    chat(id: $id) {
      ...ChatFragment
    }
  }
  ${CHAT_FRAGMENT}
`;

const POST_COMMENT = gql`
  mutation postComment($chatId: ID!, $author: ID!, $content: String!) {
    postComment(chatId: $chatId, author: $author, content: $content) {
      ...CommentFragment
    }
  }
  ${COMMENT_FRAGMENT}
`;

const LOGGED_IN_USER = gql`
  query getLoggedInUser {
    loggedInUser @client
  }
`;

const ChatWindowWithData = (): React.ReactElement => {
  // const { chatId } = React.useContext(ChatContext);
  const chatId = '1';
  const {
    data: { loggedInUser },
  } = useQuery(LOGGED_IN_USER);

  const { subscribeToMore, data: chatData } = useQuery(GET_CHAT, {
    variables: { id: chatId },
  });

  const [postComment] = useMutation(POST_COMMENT);

  const subscribeToComments = () => {
    subscribeToMore({
      document: CHAT_SUBSCRIPTION,
      variables: { chatId },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        const newComment = subscriptionData.data.commentPosted;
        return {
          chat: {
            ...prev.chat,
            comments: [newComment, ...prev.chat.comments],
          } as Chat,
        };
      },
    });
  };

  const user = loggedInUser ? loggedInUser.user : null;
  const chat = chatData ? chatData.chat : null;
  return (
    <ChatWindow
      loggedInUser={user}
      chatId={chatId}
      chat={chat}
      subscribeToComments={subscribeToComments}
      postComment={(comment: string) =>
        postComment({
          variables: { chatId, author: loggedInUser.id, content: comment },
        })}
    />
  );
};

const useStyles = makeStyles((theme) => ({
  typographyStyles: {
    flex: 1,
    color: 'white',
  },
  chatContainer: {
    position: 'relative',
    display: 'flex',
    bottom: 0,
    right: theme.spacing(10),
    flexDirection: 'column',
    // [theme.breakpoints.down('sm')]: {
    //   height: '100vh',
    // },
    // [theme.breakpoints.up('md')]: {
    //   maxHeight: theme.spacing(6),
    // },
  },
  headerButton: {
    margin: theme.spacing(1),
  },
  paper: {
    display: 'flex',
    height: '400px',
    padding: theme.spacing(0, 1),
  },
  commentsContainer: {
    height: '100%',
    overflowY: 'auto',
    overflowX: 'hidden',
  },
  toolBar: {
    backgroundColor: theme.palette.primary.main,
  },
}));

interface ChatWindowProps {
  loggedInUser: User;
  chatId: string;
  chat: Chat;
  subscribeToComments: () => void;
  postComment: (comment: string) => void;
}

const ChatWindow = ({
  loggedInUser,
  chatId,
  chat,
  subscribeToComments,
  postComment,
}: ChatWindowProps): React.ReactElement => {
  const classes = useStyles();
  const [commentText, setCommentText] = React.useState('');

  React.useEffect(() => {
    subscribeToComments();
  }, []);

  const handleSubmit = () => {
    if (!(commentText.trim() === '')) {
      postComment(commentText);
    }
    setCommentText('');
  };

  return (
    <Container className={classes.chatContainer} maxWidth="xs">
      <Paper square className={classes.paper}>
        <Grid
          container
          direction="column-reverse"
          justify="flex-start"
          wrap="nowrap"
          spacing={1}
          className={classes.commentsContainer}
        >
          {chat
            ? chat.comments.map((comment) => (
                <ChatEntry comment={comment} loggedInUser={loggedInUser} />
              ))
            : null}
        </Grid>
      </Paper>
      <Toolbar variant="dense" className={classes.toolBar}>
        <TextField
          multiline
          fullWidth
          placeholder="Aa"
          variant="outlined"
          size="small"
          value={commentText}
          onChange={(event) => setCommentText(event.target.value)}
          onKeyUp={(e) => {
            if (e.key === 'Enter') {
              handleSubmit();
            }
          }}
        />
        <IconButton
          edge="end"
          type="submit"
          color="inherit"
          disabled={commentText.trim() === ''}
          onClick={handleSubmit}
        >
          <SendIcon />
        </IconButton>
      </Toolbar>
    </Container>
  );
};

export default ChatWindowWithData;
