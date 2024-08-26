import React from 'react';

import Tooltip from '@mui/material/Tooltip';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';

import { Link } from 'react-router-dom';
import { useTheme } from '@mui/material';

export default function ActionButton(props) {
  const theme = useTheme();
  return (
    <Tooltip title={ props.tooltip } disableInteractive>
        <Fab component={Link} to={ props.to }
            variant={props.open?'extended':'round'}
            color="secondary"
            size="small"
            sx={{margin: theme.spacing(1)}}
        >
            <AddIcon 
                sx={props.open?{marginRight: theme.spacing(1)}:{}}
            />
            {props.open?props.title:''}
        </Fab>
    </Tooltip>
  );
}