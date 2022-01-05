import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
// import DashboardIcon from '@material-ui/icons/Dashboard';
// import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
// import PeopleIcon from '@material-ui/icons/People';
// import BarChartIcon from '@material-ui/icons/BarChart';
// import LayersIcon from '@material-ui/icons/Layers';
import AssignmentIcon from '@material-ui/icons/Assignment';
// import DescriptionIcon from '@material-ui/icons/Description';

import List from '@material-ui/core/List';

import Tooltip from '@material-ui/core/Tooltip';

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
