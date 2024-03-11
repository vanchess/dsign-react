import React, { useEffect }  from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { connect } from 'react-redux';
import clsx from 'clsx';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionActions from '@mui/material/AccordionActions';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';

import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

import { messageFetch } from '../../store/agreement/messageInAction.js'
import { messageFetch as contractPaymentOmsFetch } from '../../store/agreement/contractPaymentOmsAction.js'
import { messageFetch as contractFinancialSupportOmsFetch } from '../../store/agreement/contractFinancialSupportOmsAction.js'
import { messageFetch as agreementFinSalariesFetch } from '../../store/agreement/agreementFinSalariesAction.js'
//import { periodFetch } from '../../store/period/periodAction.js'
import { organizationFetch } from '../../store/organization/organizationAction.js'
import { billFilterPeriodSet, billFilterStatusSet, billFilterOrganizationSet } from '../../store/filters/bill/billFiltersAction.js'

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
  icon: {
    verticalAlign: 'bottom',
    height: 20,
    width: 20,
  },
  details: {
    alignItems: 'center',
  },
  column: {
    flexBasis: '33.33%',
  },
  helper: {
    borderLeft: `2px solid ${theme.palette.divider}`,
    padding: theme.spacing(1, 2),
  },
  link: {
    color: theme.palette.primary.main,
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
}));

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

function BillsFilter(props) {
  const classes = useStyles();

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
      props.fetchOrganization();
      fetchMessages();
  },[props.msgType]);
  
  const filterOrganizationOptions = createFilterOptions({
      stringify: (option) => option.attributes.short_name + option.attributes.name,
    });
  
  return (
    <div className={classes.root}>
      <Accordion expanded={expanded === 'filter'} onChange={handleChange('filter')} >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1c-content"
          id="panel1c-header"
        >
          <div className={classes.column}>
            <Typography className={classes.heading}></Typography>
          </div>
          <div className={classes.column}>
            <Typography className={classes.secondaryHeading}>Укажите параметры и нажмите кнопку &laquo;Загрузить&raquo;</Typography>
          </div>
          <div className={classes.column}>
            <Button disabled={props.loading} size="small" color="primary" onClick={handleButtonClick} onFocus={(event) => event.stopPropagation()} >
                Загрузить
            </Button>
          </div>
        </AccordionSummary>
        <AccordionDetails className={classes.details}>
            <Grid container spacing={2}>
                <Grid item xs={8}>
                    <Autocomplete
                          size="small"
                          fullWidth
                          multiple
                          required
                          id="organization"
                          options={props.organizationList}
                          isOptionEqualToValue={(option, value) => {return value.id == option.id;}}
                          value={props.filterOrganization}
                          groupBy={(option) => option.attributes.year}
                          disableCloseOnSelect
                          getOptionLabel={(option) => option.attributes.short_name}
                          filterOptions={filterOrganizationOptions}
                          onChange={handleChangeOrganization}
                          renderOption={(option, { selected }) => (
                            <React.Fragment>
                              <Checkbox
                                icon={icon}
                                checkedIcon={checkedIcon}
                                style={{ marginRight: 8 }}
                                checked={selected}
                              />
                              {option.attributes.short_name}
                            </React.Fragment>
                          )}
                          renderInput={(params) => (
                            <TextField {...params} label="Организации" placeholder="Начните вводить название организации" />
                          )}
                        />
                    <Autocomplete
                          size="small"
                          fullWidth
                          multiple
                          required
                          id="status"
                          options={props.statusList}
                          isOptionEqualToValue={(option, value) => {return value.id == option.id;}}
                          value={props.filterStatus}
                          groupBy={(option) => option.attributes.year}
                          disableCloseOnSelect
                          getOptionLabel={(option) => option.attributes.lable}
                          onChange={handleChangeStatus}
                          renderOption={(option, { selected }) => (
                            <React.Fragment>
                              <Checkbox
                                icon={icon}
                                checkedIcon={checkedIcon}
                                style={{ marginRight: 8 }}
                                checked={selected}
                              />
                              {option.attributes.lable}
                            </React.Fragment>
                          )}
                          renderInput={(params) => (
                            <TextField {...params} label="Статусы" placeholder="" />
                          )}
                        />
                </Grid>
                <Grid item xs={4}>
                  <div className={classes.helper}>
                    <Typography variant="caption">
                      Указанные здесь параметры применяются при загрузке данных с сервера.
                      <br />
                      Фильтры и сортировки в таблице результатов не влияют на загрузку данных с сервера и применяютя только к результату выборки.
                      <br />
                      Для получения новых данных с сервера используйте кнопку &laquo;Загрузить&raquo;.
                    </Typography>
                  </div>
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
      // periodList: store.periodReducer.items,
      statusList: store.messageStatusReducer.items,
      organizationList: store.organizationReducer.items,
      // filterPeriod: store.filtersReducer.bill.period,
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
    /*fetchPeriod: () => {
        dispatch(periodFetch(0, -1));
    },*/
    fetchOrganization: () => {
        dispatch(organizationFetch(0, -1));
    },
    /*setPeriod: (value) => {
        dispatch(billFilterPeriodSet(value));
    },*/
    setStatus: (value) => {
        dispatch(billFilterStatusSet(value));
    },
    setOrganization: (value) => {
        dispatch(billFilterOrganizationSet(value));
    }
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(BillsFilter);