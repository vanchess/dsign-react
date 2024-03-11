import React from 'react';

import clsx from 'clsx';

import Avatar from '@mui/material/Avatar';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import Divider from '@mui/material/Divider';

import ActionButton from './ActionButton';

import withStyles from '@mui/styles/withStyles';

const drawerWidth = 240;

const styles = theme => ({
  avatar: {
    margin: theme.spacing(1),
    marginRight: theme.spacing(14),
    width: theme.spacing(7),
    height: theme.spacing(7),
    // backgroundColor: theme.palette.secondary.main,
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
});


class RawSidebar extends React.Component {
    render(){
      const { classes } = this.props;

      return (
        <Drawer
          variant="permanent"
          classes={{
            paper: clsx(classes.drawerPaper, !this.props.open && classes.drawerPaperClose),
          }}
          open={this.props.open}
        >
          <div className={classes.toolbarIcon}>
            <Avatar className={classes.avatar} src="/tfoms.png" />
            <IconButton onClick={() => this.props.handleDrawerClose()} size="large">
              <ChevronLeftIcon />
            </IconButton>
          </div>
          {this.props.actions.map(a =>
              <ActionButton key={a.key} open={this.props.open} title={a.title} tooltip={a.tooltip} to={a.to} />
          )}
          <Divider />
          {this.props.children}
          <Divider />
          {/*<List>{secondaryListItems}</List>*/}
        </Drawer>
      );
    }
}

export const Sidebar = withStyles(styles)(RawSidebar);
