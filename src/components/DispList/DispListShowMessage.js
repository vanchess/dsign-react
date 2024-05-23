import React, { useEffect, useState } from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';

import ThumbDownAltOutlinedIcon from '@mui/icons-material/ThumbDownAltOutlined';

import { useDispatch, useSelector } from 'react-redux';
import { useRouteMatch } from "react-router-dom";

import ShowMessage from '../Message/ShowMessage';

import { messageService } from '../../services';
import DispListDataGrid from './DispListDataGrid';
import styled from '@emotion/styled';
import { preventiveMedicalMeasureFetch } from '../../store/displist/preventiveMedicalMeasureStore';

const ContainerStyled = styled(Container)(
  ({theme}) => ({
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(0),
  })
);

const PaperStyled = styled(Paper)(
  ({theme}) => ({
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
  })
);

export default function DispListShowMessage(props) {
  // const permission = useSelector((store) => store.authReducer.user.permissions);
  const dispatch = useDispatch();
  const match = useRouteMatch();
  const msgId = match.params.id;
  const [displistId, setDisplistId] = useState(null);

  useEffect(() => {
    dispatch(preventiveMedicalMeasureFetch());
  }, [])

  useEffect(() => {
      if (msgId) {
        messageService.getDispLists(msgId).then(
          (data) => {
            setDisplistId(data.data[0]?.id);
          }
        )
      }
  }, [msgId])


  const handleReject = () => {
    messageService.setStatus(msgId, 'rejected').then(
        () => { 
            props.history.push('/bills/msg/in') 
        },
        (err) => { 
            alert(err);
        } 
    );
  }

  return (
    <div>
      {(props.permission && props.permission.includes('reject ' + props.match.params.type)) ?
        (<ContainerStyled maxWidth="lg">
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
        </ContainerStyled>):null
      }
      <ShowMessage setTitle={props.setTitle} />
      {displistId &&
        <DispListDataGrid listId = {displistId}/>
      }
    </div>
  )
}