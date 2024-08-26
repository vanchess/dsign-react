import React from 'react';
import { useRouteMatch } from "react-router-dom";

import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';

import ThumbDownAltOutlinedIcon from '@mui/icons-material/ThumbDownAltOutlined';

import { useSelector } from 'react-redux';

import ShowMessage from '../Message/ShowMessage';

import { messageService } from '../../services';
import { ShowMessageContainerStyled } from '../Message/ShowMessageContainerStyled';
import { ShowMessagePaperStyled } from '../Message/ShowMessagePaperStyled';

export default function RegisterShowMessage(props) {
  const permission = useSelector(store => store.authReducer.user.permissions);
  const match = useRouteMatch();
  
  const handleReject = () => {
      let msgId = match.params.id;
      messageService.setStatus(msgId, 'rejected').then(
          () => { 
              this.props.history.push('/bills/msg/in') 
          },
          (err) => { 
              alert(err);
          } 
      );
  }

  return (
    <div>
        {(permission && permission.includes('reject reg')) ?
          (<ShowMessageContainerStyled maxWidth="lg" >
              <Grid container spacing={3}>
                {/* Recent Orders */}
                <Grid item xs={12}>
                  <ShowMessagePaperStyled>
                      <Button 
                        variant="contained"
                        color="primary"
                        startIcon={<ThumbDownAltOutlinedIcon />}
                        onClick={handleReject}>Отклонить</Button>
                  </ShowMessagePaperStyled>
                </Grid>
              </Grid>
          </ShowMessageContainerStyled>):null
        }
          <ShowMessage setTitle={props.setTitle} />
    </div>
  )
}