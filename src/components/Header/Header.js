import React from 'react';

import clsx from 'clsx';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import AppsIcon from '@mui/icons-material/Apps';
import Typography from '@mui/material/Typography';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import Tooltip from '@mui/material/Tooltip';
import { Link } from 'react-router-dom';

import withStyles from '@mui/styles/withStyles';

const drawerWidth = 240;

const styles = theme => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
  },
});

class RawHeader extends React.Component {
    render(){
      const { classes } = this.props;
      
      return (
        <AppBar position="absolute" className={clsx(classes.appBar, this.props.open && classes.appBarShift)}>
          <Toolbar className={classes.toolbar}>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="Open drawer"
              onClick={() => this.props.handleDrawerOpen()}
              className={clsx(classes.menuButton, this.props.open && classes.menuButtonHidden)}
              size="large">
              <MenuIcon />
            </IconButton>
            <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
                {this.props.title}
            </Typography>
            {/*
            <IconButton color="inherit">
              <Badge badgeContent={4} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            */}
            <Typography component="h1" variant="h6" color="inherit" noWrap >
                {this.props.userName}
            </Typography>
            <Tooltip title="Перейти к выбору подсистемы" disableInteractive>
              <IconButton color="inherit" component={Link} to={`/`} size="large">
                <AppsIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Выход из системы" disableInteractive>
              <IconButton color="inherit" onClick={() => this.props.logout()} size="large">
                <ExitToAppIcon />
              </IconButton>
            </Tooltip>
          </Toolbar>
        </AppBar>
      );
    }
}

export const Header = withStyles(styles)(RawHeader);
