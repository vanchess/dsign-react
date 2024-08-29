import React, { useEffect, useState } from 'react';

import Grid from '@mui/material/Grid';

import { useDispatch, useSelector } from 'react-redux';

import { messageStatusFetch } from '../../store/messageStatus/messageStatusAction.js'
import { createColumns } from './columnsDataGrid.js'
import FullScreenDialog from '../Dialog/FullScreenDialog'
import { PaperStyled } from '../Message/PaperStyled.js';
import { ContainerStyled } from '../Message/ContainerStyled.js';
import DnFilter from './DnFilter.js';
import DnList from './DnList.js';
import DnShowMessage from './DnShowMessage.js';
import { useRouteMatch } from 'react-router-dom';
import { msgItemsByTypeSelector, msgLoadingByTypeSelector } from '../../store/message/messageSelectors.js';

export default function DnIn(props) {
  const [openMessageDialog, setOpenMessageDialog] = useState(false);
  const [title, setTitle] = useState('Списки сотрудников на диспансерное наблюдение');
  const [msgTitle, setMsgTitle] = useState('Список сотрудников на диспансерное наблюдение');
  const dispatch = useDispatch();
  const match = useRouteMatch();
  const type = match.params.type;
  
  const items = useSelector(store => msgItemsByTypeSelector(store, type)); 
  const loading = useSelector(store => msgLoadingByTypeSelector(store, type));
  const statuses = useSelector(store => store.messageStatusReducer.items); 

  useEffect(() => {
      dispatch(messageStatusFetch(0, -1));

      if (match.params.id) {
        setOpenMessageDialog(true);
      }
  }, []);

  useEffect(() => {
    if (match.params.id) {
      setOpenMessageDialog(true);
    } else {
      setOpenMessageDialog(false);
    }
  }, [match.params.id]);

  useEffect(() => {
    let c = `Списки сотрудников на проф.мероприятия`;
    let m = 'Список сотрудников на проф.мероприятия';
    if (type === 'dn-list') {
      c = `Списки сотрудников на проф.мероприятия`;
      m = 'Список сотрудников на проф.мероприятия';
    }
    
    setTitle(c);
    setMsgTitle(m);

  },[type]);

  useEffect(() => {
    props.setTitle(title)
  }, [title]);

  const handleClickShowItem = (id) => {
        props.history.push(`/dn/list/${type}/${id}`);
  }

  const handleCloseDialog = () => {
        props.history.push(`/dn/list/${type}`);
        props.setTitle(title);
  };

  const columns = createColumns(statuses, handleClickShowItem);

  return (
    <div>
      <ContainerStyled maxWidth="lg">
        <Grid container spacing={3}>
          {/* Recent Orders */}
          <Grid item xs={12}>
            <PaperStyled>
              <DnFilter msgType={type} />
              <DnList 
                  rowsPerPageOptions={[10, 15, 20, 50, 100]}
                  pageSize={props.perPage}
                  items = {items}
                  columns = {columns}
                  statuses = {props.statuses}
                  loading = {loading}
                  
                  
                  page={props.page}
                      backIconButtonProps={{
                        'aria-label': 'Previous Page',
                      }}
                      nextIconButtonProps={{
                        'aria-label': 'Next Page',
                      }}
                />
            </PaperStyled>
          </Grid>
        </Grid>
      </ContainerStyled>
      <FullScreenDialog title={msgTitle} open={openMessageDialog} onClose={handleCloseDialog}>
          <DnShowMessage setTitle={props.setTitle}/>
      </FullScreenDialog>
    </div>
  );
}