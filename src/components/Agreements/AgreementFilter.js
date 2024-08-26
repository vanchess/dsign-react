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

import { messageFetch } from '../../store/agreement/messageInAction.js'
import { messageFetch as contractPaymentOmsFetch } from '../../store/agreement/contractPaymentOmsAction.js'
import { messageFetch as contractFinancialSupportOmsFetch } from '../../store/agreement/contractFinancialSupportOmsAction.js'
import { messageFetch as agreementFinSalariesFetch } from '../../store/agreement/agreementFinSalariesAction.js'
import { organizationFetch } from '../../store/organization/organizationAction.js'
import { billFilterStatusSet, billFilterOrganizationSet } from '../../store/filters/bill/billFiltersAction.js'
import { DivColumn } from '../FilterPanel/DivColumn.js';
import { Box } from '@mui/material';
import { MultipleAutocomplete } from '../FilterPanel/MultipleAutocomplete.js';

function BillsFilter(props) {

  const [expanded, setExpanded] = React.useState('filter');

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
  
  const fetchMessages = () => {

      props.fetchMessages(
        0, 
        -1, 
        props.filterStatus.map(item => item.attributes.name), 
        [],/*периоды*/
        props.filterOrganization.map(item => item.id),
      );
  }
  
  const handleButtonClick = (event) => {
      event.stopPropagation();
      fetchMessages();
      setExpanded(false);
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
      props.fetchOrganization();
      fetchMessages();
  },[props.msgType]);
  
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
            <Button disabled={props.loading} size="small" color="primary" onClick={handleButtonClick} onFocus={(event) => event.stopPropagation()} >
                Загрузить
            </Button>
          </DivColumn>
        </AccordionSummary>
        <AccordionDetails sx={{alignItems: 'center'}}>
            <Grid container spacing={2}>
                <Grid item xs={8}>
                    <MultipleAutocomplete
                          id="organization"
                          options={props.organizationList}
                          value={props.filterOrganization}
                          getOptionLabel={(option) => option.attributes.short_name}
                          filterOptions={filterOrganizationOptions}
                          onChange={handleChangeOrganization}
                          label='Организации'
                          placeholder='Начните вводить название организации'
                        />
                    <MultipleAutocomplete
                          id="status"
                          options={props.statusList}
                          value={props.filterStatus}
                          getOptionLabel={(option) => option.attributes.lable}
                          onChange={handleChangeStatus}
                          label='Статусы'
                        />
                </Grid>
                <Grid item xs={4}>
                  <Box sx={{borderLeft: theme =>  `2px solid ${theme.palette.divider}`, padding: theme =>  theme.spacing(1, 2)}}>
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
      statusList: store.messageStatusReducer.items,
      organizationList: store.organizationReducer.items,
      filterStatus: store.filtersReducer.bill.status,
      filterOrganization: store.filtersReducer.bill.organization,
    };
}
const mapDispatchToProps = (dispatch, ownProps) => {
  const type = ownProps.msgType;
  let f = (...p) => {};
  if (type === 'agreement-fin') {
      f = messageFetch;
  }
  if (type === 'contract-payment-oms') {
      f = contractPaymentOmsFetch;
  }
  if (type === 'contract-financial-support-oms') {
      f = contractFinancialSupportOmsFetch;
  }
  if (type === 'agreement-fin-salaries') {
      f = agreementFinSalariesFetch;
  }
  return {
    fetchMessages: (page, perPage, status = [], period = [], org = []) => {
        dispatch(f(page, perPage, status, period, org));
    },
    fetchOrganization: () => {
        dispatch(organizationFetch(0, -1));
    },
    setStatus: (value) => {
        dispatch(billFilterStatusSet(value));
    },
    setOrganization: (value) => {
        dispatch(billFilterOrganizationSet(value));
    }
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(BillsFilter);