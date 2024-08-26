import React from 'react';

import Avatar from '@mui/material/Avatar';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import Divider from '@mui/material/Divider';

import ActionButton from './ActionButton';
import { styled } from '@mui/material';

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden'
});

const closedMixin = (theme) => ({
  overflowX: 'hidden',
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  width: theme.spacing(7),
  [theme.breakpoints.up('sm')]: {
    width: theme.spacing(9),
  },
});

const DrawerStyled = styled(Drawer, {shouldForwardProp: prop => prop !== 'open'})(
  ({theme, open}) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  })
)

const AvatarStyled = styled(Avatar)(({theme}) => ({
  margin: theme.spacing(1),
  marginRight: theme.spacing(14),
  width: theme.spacing(7),
  height: theme.spacing(7),
}))

const DrawerHeader = styled('div')(({theme}) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: '0 8px',
  ...theme.mixins.toolbar,
}));

export const Sidebar = (props) => {
  return (
    <DrawerStyled variant="permanent" open={props.open}>
      <DrawerHeader>
        <AvatarStyled src="/tfoms.png" />
        <IconButton onClick={() => props.handleDrawerClose()} size="large">
          <ChevronLeftIcon />
        </IconButton>
      </DrawerHeader>
      {props.actions.map(a =>
          <ActionButton key={a.key} open={props.open} title={a.title} tooltip={a.tooltip} to={a.to} />
      )}
      <Divider />
      {props.children}
      <Divider />
      {/*<List>{secondaryListItems}</List>*/}
    </DrawerStyled>
  );
}