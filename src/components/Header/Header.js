import React from 'react';

import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import AppsIcon from '@mui/icons-material/Apps';
import Typography from '@mui/material/Typography';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import Tooltip from '@mui/material/Tooltip';
import { Link } from 'react-router-dom';
import { styled } from '@mui/material';
import { AppBarStyled } from './AppBarStyled';



const IconButtonStyled = styled(IconButton, {shouldForwardProp: (prop) => prop !== "hidden"})(({hidden}) => ({
  marginRight: 36,
  ...(hidden && {
    display: 'none'
  })
}))

export function Header(props) {
  return (
    <AppBarStyled position="absolute" open={props.open}>
      <Toolbar sx={{paddingRight: 24}}>
        <IconButtonStyled
          edge="start"
          color="inherit"
          aria-label="Open drawer"
          onClick={() => props.handleDrawerOpen()}
          hidden={props.open}
          size="large">
          <MenuIcon />
        </IconButtonStyled>
        <Typography component="h1" variant="h6" color="inherit" noWrap sx={{flexGrow: 1}} >
            {props.title}
        </Typography>
        {/*
        <IconButton color="inherit">
          <Badge badgeContent={4} color="secondary">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        */}
        <Typography component="h1" variant="h6" color="inherit" noWrap >
            {props.userName}
        </Typography>
        <Tooltip title="Перейти к выбору подсистемы" disableInteractive>
          <IconButton color="inherit" component={Link} to={`/`} size="large">
            <AppsIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Выход из системы" disableInteractive>
          <IconButton color="inherit" onClick={() => props.logout()} size="large">
            <ExitToAppIcon />
          </IconButton>
        </Tooltip>
      </Toolbar>
    </AppBarStyled>
  );
}