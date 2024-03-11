import React from 'react';
import { withRouter } from "react-router-dom";
import withStyles from '@mui/styles/withStyles';
import { green } from '@mui/material/colors';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import TablePagination from '@mui/material/TablePagination';

import MessageList from '../Message/MessageList';

import { connect } from 'react-redux';

import { messageFetch } from '../../store/expertise/messageInAction.js'
import { messageStartChangeRowPerPage, messageStartChangePage } from '../../store/pagination/expertise/messageInPaginationAction.js'

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
      
      this.props.setTitle('Акты МЭК');
    }
    
    componentDidMount(){
        this.props.fetchMessages(this.props.page, this.props.perPage);
        // this.props.fetchMyFiles(this.props.page, this.props.perPage);
        // this.props.fetchUsers(0, -1);
    }
  
    handleClickShowItem(id){
        this.props.history.push(`/expertise/msg/mek/${id}`)
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
                     rowsPerPageOptions={[10, 15, 50, 100, 500, 1000, 1500, {value: -1, label: 'All'}]}
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
                     
                     onPageChange={this.props.handleChangePage}
                     onRowsPerPageChange={this.props.handleChangeRowsPerPage}
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
      items: store.expertiseReducer.incoming.items, 
      page: store.paginationReducer.expertise.incoming.page, 
      perPage: store.paginationReducer.expertise.incoming.perPage,
      itemsTotal: store.paginationReducer.expertise.incoming.itemsTotal,
      loading: store.expertiseReducer.incoming.loading,
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