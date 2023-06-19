import React from 'react';

import clsx from 'clsx';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import AppsIcon from '@material-ui/icons/Apps';
import Typography from '@material-ui/core/Typography';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import Tooltip from '@material-ui/core/Tooltip';
import { Link } from 'react-router-dom';

import { withStyles } from '@material-ui/core/styles';

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
          <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
              {this.props.title}
          </Typography>
          <Typography component="h1" variant="h6" color="inherit" noWrap >
              {this.props.userName}
          </Typography>
          <Tooltip title="Перейти к выбору подсистемы">
            <IconButton 
              color="inherit"
              component={Link} 
              to={`/`}
            >
              <AppsIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Выход из системы">
            <IconButton 
              color="inherit"
              onClick={() => this.props.logout()}
            >
              <ExitToAppIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>
      );
    }
}

export const Header = withStyles(styles)(RawHeader);
