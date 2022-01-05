import React from 'react';
//import clsx from 'clsx';

import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import TablePagination from '@material-ui/core/TablePagination';


import MedicalInstitutionList from './MedicalInstitutionList';

import { withStyles } from '@material-ui/core/styles';

import { connect } from 'react-redux';

import { medicalInstitutionFetch } from '../../store/medical-institution/medicalInstitutionAction.js'
import { medicalInstitutionStartChangeRowPerPage, medicalInstitutionStartChangePage } from '../../store/pagination/medical-institution/medicalInstitutionPaginationAction.js'

const styles = theme => ({
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  //fixedHeight: {
  //  height: 240,
  //},
})

class MedicalInstitution extends React.Component {
    
    constructor(props){
      super(props);
      
      this.props.setTitle('Мед.организации');
      
      this.handleChangePage = this.handleChangePage.bind(this);
      this.handleChangeRowsPerPage = this.handleChangeRowsPerPage.bind(this);
    }
    
    componentDidMount(){
        this.props.dispatch(medicalInstitutionFetch(this.props.page, this.props.perPage));
    }
    
    handleChangePage(event, page) {
        this.props.dispatch(medicalInstitutionStartChangePage(page));
    }
  
    handleChangeRowsPerPage(event){
        let perPage = parseInt(event.target.value, 10);
        this.props.dispatch(medicalInstitutionStartChangeRowPerPage(perPage));
    }
  
  render() {
      const { classes } = this.props;
      //const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
      //this.props.handleSetTitle('123');
      
      console.log('rerender ');
      
      return (
          <main className={classes.content}>
            <div className={classes.appBarSpacer} />
            <Container maxWidth="lg" className={classes.container}>
              <Grid container spacing={3}>
                {/* Recent Orders */}
                <Grid item xs={12}>
                  <Paper className={classes.paper}>
                    <MedicalInstitutionList medicalInstitutions={this.props.medicalInstitution} rowsPerPage={this.props.perPage} page={this.props.page} loading={this.props.loading} />
                    { this.props.medicalInstitutionTotal ?
                    <TablePagination
                       rowsPerPageOptions={[10, 15, 20, 50, 100, {value: -1, label: 'All'}]}
                       component="div"
                       count= {this.props.medicalInstitutionTotal}
                       rowsPerPage={this.props.perPage}
                       page={this.props.page}
                       backIconButtonProps={{
                         'aria-label': 'Previous Page',
                       }}
                       nextIconButtonProps={{
                         'aria-label': 'Next Page',
                       }}
                       
                       onChangePage={this.handleChangePage}
                       onChangeRowsPerPage={this.handleChangeRowsPerPage}
                    /> : null }
                  </Paper>
                </Grid>
              </Grid>
            </Container>
          </main>
      );
  }
}

const mapStateToProps = function(store) {
  console.log(store);
  return {
      medicalInstitution: store.medicalInstitutionReducer.medicalInstitutions, 
      page: store.paginationReducer.medicalInstitution.page, 
      perPage: store.paginationReducer.medicalInstitution.perPage,
      medicalInstitutionTotal: store.paginationReducer.medicalInstitution.medicalInstitutionTotal,
      loading: store.medicalInstitutionReducer.loading,
    };
}

export default connect(mapStateToProps)(withStyles(styles)(MedicalInstitution));