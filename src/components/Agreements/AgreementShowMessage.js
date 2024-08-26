import React from 'react';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';

import ThumbDownAltOutlinedIcon from '@mui/icons-material/ThumbDownAltOutlined';

import { useSelector } from 'react-redux';

import ShowMessage from '../Message/ShowMessage';

import { messageService } from '../../services';
import { ShowMessageContainerStyled } from '../Message/ShowMessageContainerStyled';
import { PaperStyled } from '../Message/PaperStyled';
import { useRouteMatch, useHistory } from 'react-router-dom';

export default function RegisterShowMessage(props) {
  const permission = useSelector(store => store.authReducer.user.permissions);
  const match = useRouteMatch();
  const history = useHistory();

  const handleReject = () => {
      let msgId = match.params.id;
      messageService.setStatus(msgId, 'rejected').then(
          () => { 
              history.push('/bills/msg/in') 
          },
          (err) => { 
              alert(err);
          } 
      );
  }

  return (
    <div>
      {(permission && permission.includes('reject ' + match.params.type)) ?
        (<ShowMessageContainerStyled maxWidth="lg">
            <Grid container spacing={3}>
              {/* Recent Orders */}
              <Grid item xs={12}>
                <PaperStyled >
                    <Button 
                      variant="contained"
                      color="primary"
                      startIcon={<ThumbDownAltOutlinedIcon />}
                      onClick={handleReject}>Скрыть сообщение</Button>
                </PaperStyled>
              </Grid>
            </Grid>
        </ShowMessageContainerStyled>):null
      }
      <ShowMessage setTitle={props.setTitle} />
    </div>
  );
}