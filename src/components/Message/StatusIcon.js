import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import Chip from '@material-ui/core/Chip';

import ReportProblemIcon from '@material-ui/icons/ReportProblem';
import Tooltip from '@material-ui/core/Tooltip';
import { green, yellow } from '@material-ui/core/colors';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import AdjustIcon from '@material-ui/icons/Adjust';
import NoSimIcon from '@material-ui/icons/NoSim';
import ThumbDownAltOutlinedIcon from '@material-ui/icons/ThumbDownAltOutlined';
import ComputerIcon from '@material-ui/icons/Computer';
import CheckIcon from '@material-ui/icons/Check';
// import DoneAllIcon from '@material-ui/icons/DoneAll';
import SendIcon from '@material-ui/icons/Send';

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