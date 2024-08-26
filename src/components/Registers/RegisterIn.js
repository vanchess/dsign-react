import React from 'react';
import { withRouter } from "react-router-dom";

import Grid from '@mui/material/Grid';

import RegisterList from './RegisterList';
import RegisterShowMessage from '../Registers/RegisterShowMessage';

import { connect } from 'react-redux';

import { messageStatusFetch } from '../../store/messageStatus/messageStatusAction.js'
import { createColumns } from './columnsDataGrid.js'
import FullScreenDialog from '../Dialog/FullScreenDialog'
import RegisterFilter from './RegisterFilter'
import { ContainerStyled } from '../Message/ContainerStyled.js';
import { PaperStyled } from '../Message/PaperStyled.js';

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
      let columns = createColumns(this.props.statuses, this.handleClickShowItem);
      
      return (
          <div>
            <ContainerStyled maxWidth="lg">
              <Grid container spacing={3}>
                {/* Recent Orders */}
                <Grid item xs={12}>
                  <PaperStyled >
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
                     />
                  </PaperStyled>
                </Grid>
              </Grid>
            </ContainerStyled>
            <FullScreenDialog title={'Реестр'} open={this.state.openMessageDialog} onClose={this.handleCloseDialog}>
                <RegisterShowMessage setTitle={this.props.setTitle}/>
            </FullScreenDialog>
          </div>
      );
    }
}

const mapStateToProps = function(store) {
  return {
      items: store.registerReducer.incoming.items, 
      loading: store.registerReducer.incoming.loading,
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


export default connect(mapStateToProps,mapDispatchToProps)(withRouter(RegisterInMessage));