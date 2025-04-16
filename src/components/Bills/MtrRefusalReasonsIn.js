import React, { useEffect, useMemo } from 'react';

import Grid from '@mui/material/Grid';

import { useDispatch, useSelector } from 'react-redux';

import { messageStatusFetch } from '../../store/messageStatus/messageStatusAction.js'
import { createColumns } from './columnsDataGrid.js'
import FullScreenDialog from '../Dialog/FullScreenDialog'
import { PaperStyled } from '../Message/PaperStyled.js';
import { ContainerStyled } from '../Message/ContainerStyled.js';

import { useRouteMatch } from 'react-router-dom';
import { msgItemsByTypeSelector, msgLoadingByTypeSelector } from '../../store/message/messageSelectors.js';
import MtrRefusalReasonsFilter from './MtrRefusalReasonsFilter.js';
import MtrRefusalReasonsList from './MtrRefusalReasonsList.js';
import MtrRefusalReasonsShowMessage from './MtrRefusalReasonsShowMessage.js';

export default function MtrRefusalReasonsIn(props) {
  const dispatch = useDispatch();
  const match = useRouteMatch();
  const type = match.params.type;
  
  const items = useSelector(store => msgItemsByTypeSelector(store, type)); 
  const loading = useSelector(store => msgLoadingByTypeSelector(store, type));
  const statuses = useSelector(store => store.messageStatusReducer.items); 

  const [title, msgTitle] = useMemo(() => {
    switch (type) {
      case 'smo-fin-advance':
        return [
          `Заявки на аванс`,
          'Заявка на аванс', 
        ];
      case 'smo-fin-payment':
        return [
          `Заявки на расчет`,
          'Заявка на расчет', 
        ];
      default:
        return [
          `Заявки`,
          'Заявки', 
        ];
    }
  }, [type]);

  const openMessageDialog = useMemo(() => {
    return !!match.params.id;
  }, [match.params.id]);

  useEffect(() => {
      dispatch(messageStatusFetch(0, -1));
  }, []);

  useEffect(() => {
    props.setTitle(title)
  }, [title]);

  const handleClickShowItem = (id) => {
        props.history.push(`/smo-fin/list/${type}/${id}`);
  }

  const handleCloseDialog = () => {
        props.history.push(`/smo-fin/list/${type}`);
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
              <MtrRefusalReasonsFilter msgType={type} />
              <MtrRefusalReasonsList 
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
          <MtrRefusalReasonsShowMessage setTitle={props.setTitle}/>
      </FullScreenDialog>
    </div>
  );
}