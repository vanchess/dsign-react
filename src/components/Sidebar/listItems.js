import React from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import AssignmentIcon from '@mui/icons-material/Assignment';

import List from '@mui/material/List';

import Tooltip from '@mui/material/Tooltip';

import { Link } from 'react-router-dom';

export function MainListItems(props) { 

  return (
    <List>
        { props.sidebarMainListItems.map(i =>
            <Tooltip key={i.key} title={i.tooltip} disableInteractive>
                <ListItem button component={Link} to={i.to}>
                  <ListItemIcon>
                    {i.icon}
                  </ListItemIcon>
                  <ListItemText primary={i.title} />
                </ListItem>
            </Tooltip>
        )}
    </List>
  );
}

export const secondaryListItems = (
  <div>
    <ListSubheader inset>Saved reports</ListSubheader>
    <ListItem button component={Link} to={'/medical-institution'}>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Мед. организации" />
    </ListItem>
  </div>
);
