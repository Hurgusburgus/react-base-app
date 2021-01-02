/* eslint-disable react/jsx-props-no-spreading */

import * as React from 'react';
import { gql, useMutation, useQuery } from '@apollo/client';
import {
  makeStyles,
  withStyles,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@material-ui/core';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import SettingsIcon from '@material-ui/icons/Settings';
import { User } from '../models/models';
import { currentUserVar } from '../cache';

const CURRENT_USER = gql`
  query getCurrentUser {
    currentUser @client
  }
`;

const LOGOUT = gql`
  mutation logout {
    logout
  }
`;

interface ProfileMenuProps {
  user: User;
  loading: boolean;
  error: any;
  logout: () => void;
}

const ProfileMenuWithData = (): React.ReactElement => {
  const {
    data: { currentUser },
  } = useQuery(CURRENT_USER);
  const [logout, { loading, error }] = useMutation(LOGOUT, {
    onCompleted({ logout: logoutResponse }) {
      localStorage.removeItem('currentUser');
      currentUserVar(null);
    },
  });
  return (
    <ProfileMenu
      user={currentUser}
      logout={logout}
      loading={loading}
      error={error}
    />
  );
};

const useStyles = makeStyles((theme) => ({
  typographyStyles: {
    flex: 1,
    color: 'white',
  },
  avatar: {
    marginLeft: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
    cursor: 'pointer',
  },
  userDisplay: {
    display: 'flex',
    alignItems: 'center',
  },
  menuItem: {
    display: 'flex',
    justifyContent: 'space-between',
  },
}));

const StyledMenu = withStyles({
  paper: {
    border: '1px solid #d3d4d5',
  },
})((props: any) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'center',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'center',
    }}
    {...props}
  />
));

const ProfileMenu = ({
  user,
  loading,
  error,
  logout,
}: ProfileMenuProps): React.ReactElement => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (event: any) => {
    setAnchorEl(null);
  };

  const handleLogout = (event: any) => {
    handleClose(event);
    logout();
  };

  return (
    <>
      <div className={classes.userDisplay}>
        <Typography className={classes.typographyStyles}>
          {user ? user.username : ''}
        </Typography>
        <Avatar className={classes.avatar} onClick={handleClick}>
          <AccountCircleIcon />
        </Avatar>
      </div>
      <StyledMenu
        id="profile-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <AccountCircleIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Profile" />
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Settings" />
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <ExitToAppIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </MenuItem>
      </StyledMenu>
    </>
  );
};

export default ProfileMenuWithData;
