import React from 'react';
import { withRouter } from "react-router-dom";

import Grid from '@mui/material/Grid';

import ReconciliationActList from './ReconciliationActList';
import ShowMessage from '../Message/ShowMessage';

import { connect } from 'react-redux';

import { messageStatusFetch } from '../../store/messageStatus/messageStatusAction.js'
import { createColumns } from './reconciliationColumnsDataGrid.js'
import FullScreenDialog from '../Dialog/FullScreenDialog'
import ReconciliationActFilter from './ReconciliationActFilter'
import { ContainerStyled } from '../Message/ContainerStyled.js';
import { PaperStyled } from '../Message/PaperStyled.js';

const title = 'Акты сверки';

class ReconciliationActIn extends React.Component {
    
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
        this.props.history.push(`/bills/list/reconciliation-act/${id}`);
    }

    handleCloseDialog = () => {
        this.props.history.push(`/bills/list/reconciliation-act`);
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
      let columns = createColumns(this.props.statuses, this.handleClickShowItem);
      
      return (
          <div>
            <ContainerStyled maxWidth="lg" >
              <Grid container spacing={3}>
                {/* Recent Orders */}
                <Grid item xs={12}>
                  <PaperStyled>
                    <ReconciliationActFilter/>
                    <ReconciliationActList 
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
            <FullScreenDialog title={'Акт сверки'} open={this.state.openMessageDialog} onClose={this.handleCloseDialog}>
                <ShowMessage setTitle={this.props.setTitle}/>
            </FullScreenDialog>
          </div>
      );
    }
}

const mapStateToProps = function(store) {
  return {
      items: store.billReducer.reconciliationAct.items, 
      loading: store.billReducer.reconciliationAct.loading,
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


export default connect(mapStateToProps,mapDispatchToProps)(withRouter(ReconciliationActIn));