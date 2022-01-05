import React from 'react';
import { withRouter } from "react-router-dom";
//import clsx from 'clsx';
import { withStyles } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';

import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import TablePagination from '@material-ui/core/TablePagination';

import MessageList from '../Message/MessageList';

import { connect } from 'react-redux';

import { messageFetch } from '../../store/expertise/meeMessageInAction.js'
import { messageStartChangeRowPerPage, messageStartChangePage } from '../../store/pagination/expertise/meeMessageInPaginationAction.js'

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


class InMessage extends React.Component {
    
    constructor(props){
      super(props);
      
      this.handleClickShowItem = this.handleClickShowItem.bind(this);
      
      this.props.setTitle('Акты МЭЭ');
    }
    
    componentDidMount(){
        this.props.fetchMessages(this.props.page, this.props.perPage);
        // this.props.fetchMyFiles(this.props.page, this.props.perPage);
        // this.props.fetchUsers(0, -1);
    }
  
    handleClickShowItem(id){
        this.props.history.push(`/expertise/msg/mee/${id}`)
    }
    
  render() {
      const { classes } = this.props;
      //const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

      return (
          <div>
            <Container maxWidth="lg" className={classes.container}>
              <Grid container spacing={3}>
                {/* Recent Orders */}
                <Grid item xs={12}>
                  <Paper className={classes.paper}>

                    <MessageList 
                        items={this.props.items} 
                        rowsPerPage={this.props.perPage} 
                        page={this.props.page} 
                        loading={this.props.loading} 
                        showItem={this.handleClickShowItem}
                        displayColumnFrom={true}
                        displayColumnTo={false}
                        displayStatus={true}
                     />
                    { this.props.itemsTotal ?
                    <TablePagination
                       rowsPerPageOptions={[10, 15, 20, 50, 100, {value: -1, label: 'All'}]}
                       component="div"
                       count= {this.props.itemsTotal}
                       rowsPerPage={this.props.perPage}
                       page={this.props.page}
                       backIconButtonProps={{
                         'aria-label': 'Previous Page',
                       }}
                       nextIconButtonProps={{
                         'aria-label': 'Next Page',
                       }}
                       
                       onChangePage={this.props.handleChangePage}
                       onChangeRowsPerPage={this.props.handleChangeRowsPerPage}
                    /> : null }

                  </Paper>
                </Grid>
              </Grid>
            </Container>
          </div>
      );
  }
}

const mapStateToProps = function(store) {
  console.log(store);
  return {
      items: store.expertiseReducer.mee.items, 
      page: store.paginationReducer.expertise.mee.page, 
      perPage: store.paginationReducer.expertise.mee.perPage,
      itemsTotal: store.paginationReducer.expertise.mee.itemsTotal,
      loading: store.expertiseReducer.mee.loading,
    };
}
const mapDispatchToProps = dispatch => {
  return {
    handleChangePage: (event, page) => {
        dispatch(messageStartChangePage(page));
    },
    handleChangeRowsPerPage: (event) => {
        let perPage = parseInt(event.target.value, 10);
        dispatch(messageStartChangeRowPerPage(perPage));
    },
    fetchMessages: (page, perPage) => {
        dispatch(messageFetch(page, perPage));
    },
  }
}


export default connect(mapStateToProps,mapDispatchToProps)(withRouter(withStyles(styles)(InMessage)));