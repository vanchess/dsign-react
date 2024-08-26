import React from 'react';

import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import Tooltip from '@mui/material/Tooltip';
import { green, yellow } from '@mui/material/colors';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AdjustIcon from '@mui/icons-material/Adjust';
import NoSimIcon from '@mui/icons-material/NoSim';
import ThumbDownAltOutlinedIcon from '@mui/icons-material/ThumbDownAltOutlined';
import ComputerIcon from '@mui/icons-material/Computer';
import CheckIcon from '@mui/icons-material/Check';
import EditNoteIcon from '@mui/icons-material/EditNote';
import SendIcon from '@mui/icons-material/Send';


export default function StatusIcon(props) {
  
  if(props.name == 'sent')
  {
    return (
        <Tooltip title={props.label} aria-label={props.label} disableInteractive>
            <ReportProblemIcon color="secondary" />
        </Tooltip>
    );
  }
  if(props.name == 'signed_by_specialist')
  {
    return (
        <Tooltip title={props.label} aria-label={props.label} disableInteractive>
            <AdjustIcon color="secondary" />
        </Tooltip>
    );
  }
  if(props.name == 'ready')
  {
      return (
        <Tooltip title={props.label} aria-label={props.label} disableInteractive>
            <CheckIcon style={{ color: green[500] }} />
        </Tooltip>
      );
  }
  if(props.name == 'no_files')
  {
      return (
        <Tooltip title={props.label} aria-label={props.label} disableInteractive>
            <NoSimIcon color="primary" />
        </Tooltip>
      );
  }
  if(props.name == 'rejected' || props.name == 'rejected_flc')
  {
      return (
        <Tooltip title={props.label} aria-label={props.label} disableInteractive>
            <ThumbDownAltOutlinedIcon color="secondary" />
        </Tooltip>
      );
  }
  if(props.name == 'signed_mo')
  {
    return (
        <Tooltip title={props.label} aria-label={props.label} disableInteractive>
            <CheckCircleIcon style={{ color: yellow[500] }} />
        </Tooltip>
    );
  }
  if(props.name == 'in_progress')
  {
      return (
        <Tooltip title={props.label} aria-label={props.label} disableInteractive>
            <ComputerIcon style={{ color: yellow[500] }} />
        </Tooltip>
      );
  }
  if(props.name == 'loaded')
  {
      return (
        <Tooltip title={props.label} aria-label={props.label} disableInteractive>
            <ComputerIcon style={{ color: green[500] }} />
        </Tooltip>
      );
  }
  if(props.name == 'sent-to-smo')
  {
      return (
        <Tooltip title={props.label} aria-label={props.label} disableInteractive>
            <SendIcon style={{ color: green[500] }} />
        </Tooltip>
      );
  }
  if(props.name == 'draft')
  {
      return (
        <Tooltip title={props.label} aria-label={props.label} disableInteractive>
            <EditNoteIcon color="secondary" />
        </Tooltip>
      );
  }
  
   return (
        <Tooltip title={props.label} aria-label={props.label} disableInteractive>
            <AdjustIcon style={{ color: yellow[500] }} />
        </Tooltip>
   );
}