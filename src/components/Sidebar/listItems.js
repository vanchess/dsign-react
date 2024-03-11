import React from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
// import DashboardIcon from '@mui/icons-material/Dashboard';
// import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
// import PeopleIcon from '@mui/icons-material/People';
// import BarChartIcon from '@mui/icons-material/BarChart';
// import LayersIcon from '@mui/icons-material/Layers';
import AssignmentIcon from '@mui/icons-material/Assignment';
// import DescriptionIcon from '@mui/icons-material/Description';

import List from '@mui/material/List';

import Tooltip from '@mui/material/Tooltip';

import { Link } from 'react-router-dom';

export function MainListItems(props) { 

  return (
    <List>
        { props.sidebarMainListItems.map(i =>
            <Tooltip key={i.key} title={i.tooltip}>
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
