import React from 'react';

import { makeStyles } from '@material-ui/core/styles';

import Tooltip from '@material-ui/core/Tooltip';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';

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
    <Tooltip title={ props.tooltip }>
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