import React from 'react';
import { withRouter } from "react-router-dom";

import Grid from '@mui/material/Grid';

import BillList from './BillList';
import BillsShowMessage from '../Bills/BillsShowMessage';

import { connect } from 'react-redux';

import { messageStatusFetch } from '../../store/messageStatus/messageStatusAction.js'
import { createColumns } from './columnsDataGrid.js'
import FullScreenDialog from '../Dialog/FullScreenDialog'
import BillsFilter from './BillsFilter'
import { ContainerStyled } from '../Message/ContainerStyled.js';
import { PaperStyled } from '../Message/PaperStyled.js';

const title = 'Счета';

class BillsInMessage extends React.Component {
    
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
    }
  
    handleClickShowItem(id){
        this.props.history.push(`/bills/list/bill/${id}`);
    }

    handleCloseDialog = () => {
        this.props.history.push(`/bills/list/bill`);
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

      let columns = createColumns(this.props.statuses, this.handleClickShowItem);
      
      return (
          <div>
            <ContainerStyled maxWidth="lg" >
              <Grid container spacing={3}>
                {/* Recent Orders */}
                <Grid item xs={12}>
                  <PaperStyled >
                    <BillsFilter/>
                    <BillList 
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
                     />
                  </PaperStyled>
                </Grid>
              </Grid>
            </ContainerStyled>
            <FullScreenDialog title={'Счет'} open={this.state.openMessageDialog} onClose={this.handleCloseDialog}>
                <BillsShowMessage setTitle={this.props.setTitle}/>
            </FullScreenDialog>
          </div>
      );
    }
}

const mapStateToProps = function(store) {
  return {
      items: store.billReducer.incoming.items, 
      loading: store.billReducer.incoming.loading,
      statuses: store.messageStatusReducer.items, 
    };
}
const mapDispatchToProps = dispatch => {
  return {
    fetchMessageStatuses: () => {
        dispatch(messageStatusFetch(0, -1));
    },
  }
}


export default connect(mapStateToProps,mapDispatchToProps)(withRouter(BillsInMessage));