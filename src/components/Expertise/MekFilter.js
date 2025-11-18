import React, { useEffect }  from 'react';

import { connect } from 'react-redux';
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

import { messageFetch as rmeeFetch } from '../../store/expertise/rmeeMessageInAction'
import { messageFetch as meeFetch } from '../../store/expertise/meeMessageInAction'
import { messageFetch as mekFetch } from '../../store/expertise/messageInAction'

import { organizationFetch } from '../../store/organization/organizationAction.js'
import { billFilterPeriodSet, billFilterStatusSet, billFilterOrganizationSet } from '../../store/filters/bill/billFiltersAction.js'
import { periodFetch } from '../../store/period/periodAction';
import { Box } from '@mui/material';
import { DivColumn } from '../FilterPanel/DivColumn.js';
import { MultipleAutocomplete } from '../FilterPanel/MultipleAutocomplete.js';


function MekFilter(props) {

  const [expanded, setExpanded] = React.useState('filter');

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
  
  const fetchMessages = ({filterPeriod}={}) => {

      if (!filterPeriod) {
        filterPeriod = props.filterPeriod;
      }

      props.fetchMessages(
        0, 
        -1, 
        props.filterStatus.map(item => item.attributes.name), 
        filterPeriod.map(item => item.id),
        props.filterOrganization.map(item => item.id),
      );
  }
  
  const handleButtonClick = (event) => {
      event.stopPropagation();
      fetchMessages();
      setExpanded(false);
  };
  
  const handleChangePeriod = (e, newValue) => {
    e.preventDefault();
    props.setPeriod(newValue);
  };
  
  const handleChangeStatus = (e, newValue) => {
    e.preventDefault();
    props.setStatus(newValue);
  }; 
  const handleChangeOrganization = (e, newValue) => {
    e.preventDefault();
    props.setOrganization(newValue);
  };
  
  useEffect( () => {
      props.fetchPeriod();  
      props.fetchOrganization();
      fetchMessages();
  },[props.msgType]);
  
  useEffect( () => {
    if(props.periodList.length && !props.filterPeriod.length) {
      let now = Date.now();
      let previousMonth = new Date();
      previousMonth.setDate(0); // 0 will result in the last day of the previous month
      let newFilterPeriod = props.periodList.reduce((acc, cur) => {
          let dtFrom = new Date(cur.attributes.from);
          let dtTo   = new Date(cur.attributes.to)
          if (
              (dtFrom <= previousMonth && previousMonth <= dtTo)
              || (dtFrom <= now && now <= dtTo)
          ) {
              acc.push(cur);
          }
          return acc;
      }, [] );
      props.setPeriod(newFilterPeriod);
      fetchMessages({filterPeriod: newFilterPeriod});
    }
},[props.periodList]);

const periodList = props.periodList.slice().sort(function(a, b) {
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
          <DivColumn >
            <Typography sx={{fontSize: theme =>  theme.typography.pxToRem(15), color: theme => theme.palette.text.secondary,}}>Укажите параметры и нажмите кнопку &laquo;Загрузить&raquo;</Typography>
          </DivColumn>
          <DivColumn >
            <Button disabled={props.loading} size="small" color="primary" onClick={handleButtonClick} onFocus={(event) => event.stopPropagation()} >
                Загрузить
            </Button>
          </DivColumn>
        </AccordionSummary>
        <AccordionDetails sx={{alignItems: 'center'}}>
            <Grid container spacing={2}>
                <Grid item xs={8}>
                    <MultipleAutocomplete
                          id="period"
                          options={periodList}
                          value={props.filterPeriod}
                          groupBy={(option) => option.attributes.year}
                          onChange={handleChangePeriod}
                          label="Периоды"
                        />
                    <MultipleAutocomplete
                          id="organization"
                          options={props.organizationList}
                          value={props.filterOrganization}
                          getOptionLabel={(option) => option.attributes.short_name}
                          filterOptions={filterOrganizationOptions}
                          onChange={handleChangeOrganization}
                          label="Организации"
                          placeholder="Начните вводить название организации"
                        />
                    <MultipleAutocomplete
                          id="status"
                          options={props.statusList}
                          value={props.filterStatus}
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
          <Button size="small" color="primary" disabled={props.loading} onClick={handleButtonClick}>
            Загрузить
          </Button>
        </AccordionActions>
      </Accordion>
    </div>
  );
}

const mapStateToProps = function(store) {
  return {
      loading: store.agreementReducer.incoming.loading,
      periodList: store.periodReducer.items,
      statusList: store.messageStatusReducer.items,
      organizationList: store.organizationReducer.items,
      filterPeriod: store.filtersReducer.bill.period,
      filterStatus: store.filtersReducer.bill.status,
      filterOrganization: store.filtersReducer.bill.organization,
    };
}
const mapDispatchToProps = (dispatch, ownProps) => {
  const type = ownProps.msgType;
  let f = (...p) => {};
  if (type === 'mek') {
      f = mekFetch;
  }
  if (type === 'mee') {
      f = meeFetch;
  }
  if (type === 'rmee') {
      f = rmeeFetch;
  }
  return {
    fetchMessages: (page, perPage, status = [], period = [], org = []) => {
        dispatch(f(page, perPage, status, period, org));
    },
    fetchPeriod: () => {
      dispatch(periodFetch(0, -1));
    },
    fetchOrganization: () => {
        dispatch(organizationFetch(0, -1));
    },
    setPeriod: (value) => {
        dispatch(billFilterPeriodSet(value));
    },
    setStatus: (value) => {
        dispatch(billFilterStatusSet(value));
    },
    setOrganization: (value) => {
        dispatch(billFilterOrganizationSet(value));
    }
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(MekFilter);