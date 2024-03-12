import React from 'react';

import makeStyles from '@mui/styles/makeStyles';

import Tooltip from '@mui/material/Tooltip';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';

import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  margin: {
    margin: theme.spacing(1),
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
}));

export default function ActionButton(props) { 
  const classes = useStyles();
  
  return (
    <Tooltip title={ props.tooltip } disableInteractive>
        <Fab component={Link} to={ props.to }
            variant={props.open?'extended':'round'}
            color="secondary"
            size="small"
            className={classes.margin}
        >
            <AddIcon 
                className={props.open?classes.extendedIcon:''}
            />
            {props.open?props.title:''}
        </Fab>
    </Tooltip>
  );
}