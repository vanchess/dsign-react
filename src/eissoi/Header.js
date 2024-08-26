import React from 'react';

import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import AppsIcon from '@mui/icons-material/Apps';
import Typography from '@mui/material/Typography';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import Tooltip from '@mui/material/Tooltip';
import { Link } from 'react-router-dom';
import { AppBarStyled } from '../components/Header/AppBarStyled';


export const Header = (props) => {
  return (
    <AppBarStyled position="absolute" open={props.open} >
      <Toolbar sx={{paddingRight: 24}}>
        <Typography component="h1" variant="h6" color="inherit" noWrap sx={{flexGrow: 1}}>
            {props.title}
        </Typography>
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