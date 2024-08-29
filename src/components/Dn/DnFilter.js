import React, { useEffect }  from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionActions from '@mui/material/AccordionActions';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';

import { createFilterOptions } from '@mui/material/Autocomplete';

import { periodFetch } from '../../store/period/periodAction.js'
import { organizationFetch } from '../../store/organization/organizationAction.js'
import { billFilterPeriodSet, billFilterStatusSet, billFilterOrganizationSet } from '../../store/filters/bill/billFiltersAction.js'
import { DivColumn } from '../FilterPanel/DivColumn.js';
import { MultipleAutocomplete } from '../FilterPanel/MultipleAutocomplete.js';
import { Box } from '@mui/material';
import { msgDnContractFetch } from '../../store/dn/dnContractMsgStore.js';

export default function DnFilter(props) {
  const dispatch = useDispatch();
  
  const loading = useSelector(store => store.agreementReducer.incoming.loading);
  const periodList = useSelector(store => store.periodReducer.items);
  const statusList = useSelector(store => store.messageStatusReducer.items);
  const organizationList = useSelector(store => store.organizationReducer.items);
  const filterPeriod = useSelector(store => store.filtersReducer.bill.period);
  const filterStatus = useSelector(store => store.filtersReducer.bill.status);
  const filterOrganization = useSelector(store => store.filtersReducer.bill.organization);

  const fetchMsg = (page, perPage, status = [], period = [], org = []) => {
      
    if (props.msgType === 'dn-list') {
      // dispatch(msgDnContractFetch(page, perPage, status, period, org));
    }
    if (props.msgType === 'dn-contract') {
      dispatch(msgDnContractFetch(page, perPage, status, period, org));
    }
  };

  const fetchPeriod = () => {dispatch(periodFetch(0, -1));};
  const fetchOrganization = () => {dispatch(organizationFetch(0, -1));};
  const setPeriod = (value) => {dispatch(billFilterPeriodSet(value));};
  const setStatus = (value) => {dispatch(billFilterStatusSet(value));};
  const setOrganization = (value) => {dispatch(billFilterOrganizationSet(value));};
  

  const [expanded, setExpanded] = React.useState('filter');

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
  
  const fetchMessages = ({filterPeriod:fp}={}) => {

    if (!fp) {
      fp = filterPeriod;
    }

    fetchMsg(
      0, 
      -1, 
      filterStatus.map(item => item.attributes.name), 
      fp.map(item => item.id),
      filterOrganization.map(item => item.id),
    );
}
  
  const handleButtonClick = (event) => {
      event.stopPropagation();
      fetchMessages();
      setExpanded(false);
  };
  
  const handleChangePeriod = (e, newValue) => {
    e.preventDefault();
    setPeriod(newValue);
  };
  
  const handleChangeStatus = (e, newValue) => {
    e.preventDefault();
    setStatus(newValue);
  }; 
  const handleChangeOrganization = (e, newValue) => {
    e.preventDefault();
    setOrganization(newValue);
  };
  
  useEffect( () => {
      fetchPeriod();
      fetchOrganization();
      if (filterPeriod.length) {
          fetchMessages();
      }
  },[props.msgType]);

  useEffect( () => {
      if(periodList.length && !filterPeriod.length) {
        let previousMonth = new Date();
        previousMonth.setDate(0); // 0 will result in the last day of the previous month
        let newFilterPeriod = periodList.reduce((acc, cur) => {
            let dtTo   = new Date(cur.attributes.to)
            if (previousMonth <= dtTo) {
                acc.push(cur);
            }
            return acc;
        }, [] );
        setPeriod(newFilterPeriod);
        
        fetchMessages({filterPeriod: newFilterPeriod});
      }
  },[periodList]);
  
  const periodListSorted = periodList.slice().sort(function(a, b) {
    if (a.attributes.from < b.attributes.from) {
      return 1; }
    if (a.attributes.from > b.attributes.from) {
      return -1; }
    return 0;
  });

  const filterOrganizationOptions = createFilterOptions({
      stringify: (option) => option.attributes.short_name + option.attributes.name,
    });
  
  return (
    <div style={{width: '100%'}}>
      <Accordion expanded={expanded === 'filter'} onChange={handleChange('filter')} >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1c-content"
          id="panel1c-header"
        >
          <DivColumn>
            <Typography sx={{fontSize: theme => theme.typography.pxToRem(15)}}></Typography>
          </DivColumn>
          <DivColumn>
            <Typography sx={{fontSize: theme => theme.typography.pxToRem(15), color: theme => theme.palette.text.secondary}}>Укажите параметры и нажмите кнопку &laquo;Загрузить&raquo;</Typography>
          </DivColumn>
          <DivColumn>
            <Button disabled={loading} size="small" color="primary" onClick={handleButtonClick} onFocus={(event) => event.stopPropagation()} >
                Загрузить
            </Button>
          </DivColumn>
        </AccordionSummary>
        <AccordionDetails sx={{alignItems: 'center'}}>
            <Grid container spacing={2}>
                <Grid item xs={8}>
                    <MultipleAutocomplete
                          id="period"
                          options={periodListSorted}
                          value={filterPeriod}
                          groupBy={(option) => option.attributes.year}
                          onChange={handleChangePeriod}
                          label="Периоды"
                        />
                    <MultipleAutocomplete
                          id="organization"
                          options={organizationList}
                          value={filterOrganization}
                          groupBy={(option) => option.attributes.year}
                          getOptionLabel={(option) => option.attributes.short_name}
                          filterOptions={filterOrganizationOptions}
                          onChange={handleChangeOrganization}
                          label="Организации"
                          placeholder="Начните вводить название организации"
                        />
                    <MultipleAutocomplete
                          id="status"
                          options={statusList}
                          value={filterStatus}
                          groupBy={(option) => option.attributes.year}
                          getOptionLabel={(option) => option.attributes.lable}
                          onChange={handleChangeStatus}
                          label="Статусы"
                        />
                </Grid>
                <Grid item xs={4}>
                  <Box sx={{borderLeft: theme => `2px solid ${theme.palette.divider}`, padding: theme => theme.spacing(1, 2)}}>
                    <Typography variant="caption">
                      Указанные здесь параметры применяются при загрузке данных с сервера.
                      <br />
                      Фильтры и сортировки в таблице результатов не влияют на загрузку данных с сервера и применяютя только к результату выборки.
                      <br />
                      Для получения новых данных с сервера используйте кнопку &laquo;Загрузить&raquo;.
                    </Typography>
                  </Box>
                </Grid>
            </Grid>
        </AccordionDetails>
        <Divider />
        <AccordionActions>
          <Button size="small" color="primary" disabled={loading} onClick={handleButtonClick}>
            Загрузить
          </Button>
        </AccordionActions>
      </Accordion>
    </div>
  );
}