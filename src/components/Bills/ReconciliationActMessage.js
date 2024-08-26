import React from 'react';
import { withRouter } from "react-router-dom";
import { green } from '@mui/material/colors';

import Grid from '@mui/material/Grid';
import TablePagination from '@mui/material/TablePagination';

import MessageList from '../Message/MessageList';

import { connect } from 'react-redux';

import { messageFetch } from '../../store/bill/reconciliationActAction.js'
import { messageStartChangeRowPerPage, messageStartChangePage } from '../../store/pagination/bill/reconciliationActPaginationAction.js'
import { ContainerStyled } from '../Message/ContainerStyled.js';
import { PaperStyled } from '../Message/PaperStyled.js';

class BillsInMessage extends React.Component {
    
    constructor(props){
      super(props);
      
      this.handleClickShowItem = this.handleClickShowItem.bind(this);
      
      this.props.setTitle('Акты сверки');
    }
    
    componentDidMount(){
        this.props.fetchMessages(this.props.page, this.props.perPage);
    }
  
    handleClickShowItem(id){
        this.props.history.push(`/bills/msg/${id}`)
    }
    
  render() {
      return (
        <div>
          <ContainerStyled maxWidth="lg">
            <Grid container spacing={3}>
              {/* Recent Orders */}
              <Grid item xs={12}>
                <PaperStyled>
                  <MessageList 
                      items={this.props.items} 
                      rowsPerPage={this.props.perPage} 
                      page={this.props.page} 
                      loading={this.props.loading} 
                      showItem={this.handleClickShowItem}
                      displayColumnFrom={true}
                      displayCategory={false}
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
      items: store.billReducer.reconciliationAct.items, 
      page: store.paginationReducer.bill.reconciliationAct.page, 
      perPage: store.paginationReducer.bill.reconciliationAct.perPage,
      itemsTotal: store.paginationReducer.bill.reconciliationAct.itemsTotal,
      loading: store.billReducer.reconciliationAct.loading,
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

export default connect(mapStateToProps,mapDispatchToProps)(withRouter(BillsInMessage));