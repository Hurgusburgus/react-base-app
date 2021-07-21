import * as React from 'react';
import { makeStyles, Grid, Box, Typography } from '@material-ui/core';
import { User, Comment } from '../models/models';

const useStyles = makeStyles((theme) => ({
  typographyStyles: {
    flex: 1,
    color: 'white',
  },
  buttonContainer: {
    flex: 1,
  },
  headerButton: {
    margin: theme.spacing(1),
  },
  paper: {
    paddingBottom: 50,
  },
  appBar: {
    top: 'auto',
    bottom: 0,
  },
  contentLine: {
    maxWidth: '60%',
  },
  commentContent: {
    borderRadius: theme.spacing(1),
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    display: 'inline-block',
  },
  myComment: {
    borderRadius: theme.spacing(1, 1, 1, 0),
    backgroundColor: theme.palette.primary.main,
  },
  theirComment: {
    borderRadius: theme.spacing(1, 1, 0, 1),
    backgroundColor: theme.palette.secondary.main,
  },
}));

interface ChatEntryProps {
  comment: Comment;
  loggedInUser: User;
}

const ChatEntry = ({
  comment,
  loggedInUser,
}: ChatEntryProps): React.ReactElement => {
  const classes = useStyles();
  if (!comment) {
    return null;
  }
  const myComment = comment.author.id === loggedInUser.id;

  return (
    <Grid
      item
      key={comment.id}
      container
      direction="column"
      alignItems={myComment ? 'flex-start' : 'flex-end'}
    >
      <Grid item component="div">
        {comment.author.username}
      </Grid>
      <Grid
        component="div"
        item
        container
        direction={myComment ? 'row' : 'row-reverse'}
        alignItems="center"
        spacing={2}
      >
        <Grid item component="div" className={classes.contentLine}>
          <div
            className={`${classes.commentContent} ${
              myComment ? classes.myComment : classes.theirComment
            }`}
          >
            <Typography>{comment.content}</Typography>
          </div>
        </Grid>
        <Grid item component="div">
          {new Date(parseInt(comment.timestamp, 10)).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ChatEntry;
