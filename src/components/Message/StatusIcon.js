import React, { useEffect, useState } from 'react';
import makeStyles from '@mui/styles/makeStyles';

import Chip from '@mui/material/Chip';

import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import Tooltip from '@mui/material/Tooltip';
import { green, yellow } from '@mui/material/colors';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AdjustIcon from '@mui/icons-material/Adjust';
import NoSimIcon from '@mui/icons-material/NoSim';
import ThumbDownAltOutlinedIcon from '@mui/icons-material/ThumbDownAltOutlined';
import ComputerIcon from '@mui/icons-material/Computer';
import CheckIcon from '@mui/icons-material/Check';
// import DoneAllIcon from '@mui/icons-material/DoneAll';
import SendIcon from '@mui/icons-material/Send';

const useStyles = makeStyles((theme) => ({
  /*
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  */
}));


export default function StatusIcon(props) {
  const classes = useStyles();
  
  if(props.name == 'sent')
  {
    return (
        <Tooltip title={props.label} aria-label={props.label}>
            <ReportProblemIcon color="secondary" />
        </Tooltip>
    );
  }
  if(props.name == 'signed_by_specialist')
  {
    return (
        <Tooltip title={props.label} aria-label={props.label}>
            <AdjustIcon color="secondary" />
        </Tooltip>
    );
  }
  if(props.name == 'ready')
  {
      return (
        <Tooltip title={props.label} aria-label={props.label}>
            <CheckIcon style={{ color: green[500] }} />
        </Tooltip>
      );
  }
  if(props.name == 'no_files')
  {
      return (
        <Tooltip title={props.label} aria-label={props.label}>
            <NoSimIcon color="primary" />
        </Tooltip>
      );
  }
  if(props.name == 'rejected' || props.name == 'rejected_flc')
  {
      return (
        <Tooltip title={props.label} aria-label={props.label}>
            <ThumbDownAltOutlinedIcon color="secondary" />
        </Tooltip>
      );
  }
  if(props.name == 'signed_mo')
  {
    return (
        <Tooltip title={props.label} aria-label={props.label}>
            <CheckCircleIcon style={{ color: yellow[500] }} />
        </Tooltip>
    );
  }
  if(props.name == 'in_progress')
  {
      return (
        <Tooltip title={props.label} aria-label={props.label}>
            <ComputerIcon style={{ color: yellow[500] }} />
        </Tooltip>
      );
  }
  if(props.name == 'loaded')
  {
      return (
        <Tooltip title={props.label} aria-label={props.label}>
            <ComputerIcon style={{ color: green[500] }} />
        </Tooltip>
      );
  }
  if(props.name == 'sent-to-smo')
  {
      return (
        <Tooltip title={props.label} aria-label={props.label}>
            <SendIcon style={{ color: green[500] }} />
        </Tooltip>
      );
  }
  
  
   return (
        <Tooltip title={props.label} aria-label={props.label}>
            <AdjustIcon style={{ color: yellow[500] }} />
        </Tooltip>
   );
}