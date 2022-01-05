import React from 'react';
import { withRouter } from "react-router-dom";
//import clsx from 'clsx';
import { withStyles } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';

import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import TablePagination from '@material-ui/core/TablePagination';

import RegisterList from './RegisterList';
import RegisterShowMessage from '../Registers/RegisterShowMessage';

import { connect } from 'react-redux';

import { messageStatusFetch } from '../../store/messageStatus/messageStatusAction.js'
// import { messageStartChangeRowPerPage, messageStartChangePage } from '../../store/pagination/bill/messageInPaginationAction.js'
import { createColumns } from './columnsDataGrid.js'
import FullScreenDialog from '../Dialog/FullScreenDialog'
import RegisterFilter from './RegisterFilter'

const styles = theme => ({
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
  
  root: {
    display: 'flex',
    alignItems: 'center',
  },
  wrapper: {
    margin: theme.spacing(1),
    position: 'relative',
  },
  buttonProgress: {
    color: green[500],
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
  buttonSendDiv: {
    textAlign: 'right',
  }
  //fixedHeight: {
  //  height: 240,
  //},
})

const title = 'Реестры';

class RegisterInMessage extends React.Component {
    
    constructor(props){
      super(props);
      
      this.state = {
        openMessageDialog: false,
      };
      
      this.handleClickShowItem   = this.handleClickShowItem.bind(this);
      this.handleCloseDialog     = this.handleCloseDialog.bind(this);
      
      this.props.setTitle(title);
    }
    
    componentDidMount(){
        this.props.fetchMessageStatuses();
        
        if (this.props.match.params.id) {
            this.setState({openMessageDialog: true});
        }
        // this.props.fetchMyFiles(this.props.page, this.props.perPage);
        // this.props.fetchUsers(0, -1);
    }
  
    handleClickShowItem(id){
        this.props.history.push(`/registers/list/${this.props.match.params.type}/${id}`);
    }

    handleCloseDialog = () => {
        this.props.history.push(`/registers/list/${this.props.match.params.type}`);
        this.props.setTitle(title);
    };
    
    componentDidUpdate(prevProps, prevState) {
      if (prevProps.match.params.id !== this.props.match.params.id) {
        if (this.props.match.params.id) {
            this.setState({openMessageDialog: true});
        } else {
            this.setState({openMessageDialog: false});
        }
      }
    }
    
    render() {
      const { classes } = this.props;
      //const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
      
      /*
      if (columns.length > 0) {
        const statusColumn = columns.find((column) => column.field === 'status');
        const statusColIndex = columns.findIndex((col) => col.field === 'status');

        const newStatusColumn = {
          ...statusColumn,
          filterOperators: [inOperator(this.props.statuses), notInOperator(this.props.statuses)],
        };

        columns[statusColIndex] = newStatusColumn;
        columns = Array.from(columns);
      }
      */
      let columns = createColumns(this.props.statuses, this.handleClickShowItem);
      
      return (
          <div>
            <Container maxWidth="lg" className={classes.container}>
              <Grid container spacing={3}>
                {/* Recent Orders */}
                <Grid item xs={12}>
                  <Paper className={classes.paper}>
                    <RegisterFilter/>
                    <RegisterList 
                        rowsPerPageOptions={[10, 15, 20, 50, 100]}
                        pageSize={this.props.perPage}
                        items = {this.props.items}
                        columns = {columns}
                        statuses = {this.props.statuses}
                        loading = {this.props.loading}
                        
                        
                        page={this.props.page}
                           backIconButtonProps={{
                             'aria-label': 'Previous Page',
                           }}
                           nextIconButtonProps={{
                             'aria-label': 'Next Page',
                           }}
                           
                           //onChangePage={this.props.handleChangePage}
                           //onChangeRowsPerPage={this.props.handleChangeRowsPerPage}
                     />
                  </Paper>
                </Grid>
              </Grid>
            </Container>
            <FullScreenDialog title={'Реестр'} open={this.state.openMessageDialog} onClose={this.handleCloseDialog}>
                <RegisterShowMessage setTitle={this.props.setTitle}/>
            </FullScreenDialog>
          </div>
      );
    }
}

const mapStateToProps = function(store) {
  console.log(store);
  return {
      items: store.registerReducer.incoming.items, 
      // page: store.paginationReducer.bill.incoming.page, 
      // perPage: store.paginationReducer.bill.incoming.perPage,
      // itemsTotal: store.paginationReducer.bill.incoming.itemsTotal,
      loading: store.registerReducer.incoming.loading,
      statuses: store.messageStatusReducer.items, 
    };
}
const mapDispatchToProps = dispatch => {
  return {
    /*
    handleChangePage: (event, page) => {
        dispatch(messageStartChangePage(page));
    },
    handleChangeRowsPerPage: (event) => {
        let perPage = parseInt(event.target.value, 10);
        dispatch(messageStartChangeRowPerPage(perPage));
    },
    */
    fetchMessageStatuses: () => {
        dispatch(messageStatusFetch(0, -1));
    },
  }
}


export default connect(mapStateToProps,mapDispatchToProps)(withRouter(withStyles(styles)(RegisterInMessage)));