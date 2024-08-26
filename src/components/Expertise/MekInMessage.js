import React from 'react';
import { withRouter } from "react-router-dom";
import Grid from '@mui/material/Grid';
import TablePagination from '@mui/material/TablePagination';

import MessageList from '../Message/MessageList';

import { connect } from 'react-redux';

import { messageFetch } from '../../store/expertise/messageInAction.js'
import { messageStartChangeRowPerPage, messageStartChangePage } from '../../store/pagination/expertise/messageInPaginationAction.js'
import { ContainerStyled } from '../Message/ContainerStyled.js';
import { PaperStyled } from '../Message/PaperStyled.js';


class InMessage extends React.Component {
    
    constructor(props){
      super(props);
      
      this.handleClickShowItem = this.handleClickShowItem.bind(this);
      
      this.props.setTitle('Акты МЭК');
    }
    
    componentDidMount(){
        this.props.fetchMessages(this.props.page, this.props.perPage);
    }
  
    handleClickShowItem(id){
        this.props.history.push(`/expertise/msg/mek/${id}`)
    }
    
  render() {
      const { classes } = this.props;

      return (
        <div>
          <ContainerStyled maxWidth="lg" className={classes.container}>
            <Grid container spacing={3}>
              {/* Recent Orders */}
              <Grid item xs={12}>
                <PaperStyled className={classes.paper}>

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

                </PaperStyled>
              </Grid>
            </Grid>
          </ContainerStyled>
        </div>
      );
  }
}

const mapStateToProps = function(store) {
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

export default connect(mapStateToProps,mapDispatchToProps)(withRouter(InMessage));