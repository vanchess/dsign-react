import React from 'react';
import { withRouter } from "react-router-dom";

import Grid from '@mui/material/Grid';

import AgreementList from './AgreementList';
import AgreementShowMessage from '../Agreements/AgreementShowMessage';

import { connect } from 'react-redux';

import { messageStatusFetch } from '../../store/messageStatus/messageStatusAction.js'
import { createColumns } from './columnsDataGrid.js'
import FullScreenDialog from '../Dialog/FullScreenDialog'
import AgreementFilter from './AgreementFilter'
import { ContainerStyled } from '../Message/ContainerStyled.js';
import { PaperStyled } from '../Message/PaperStyled.js';

class AgreementsInMessage extends React.Component {
    
    constructor(props){
      super(props);
      
      this.state = {
        openMessageDialog: false,
        title: 'Соглашения',
        msgTitle: 'Соглашение',
      };
      
      this.handleClickShowItem   = this.handleClickShowItem.bind(this);
      this.handleCloseDialog     = this.handleCloseDialog.bind(this);
    }
    
    componentDidMount(){
        this.props.fetchMessageStatuses();
        
        if (this.props.match.params.id) {
            this.setState({openMessageDialog: true});
        }
        
        const type = this.props.match.params.type;
        let c = `Соглашения`;
        let m = 'Соглашение';
        if (type === 'agreement-fin') {
            c = `Соглашения`;
            m = 'Соглашение';
        }
        if (type === 'contract-payment-oms') {
            c = `Договоры на оказание и оплату медицинской помощи по ОМС`;
            m = `Договор на оказание и оплату медицинской помощи по ОМС`;
        }
        if (type === 'contract-financial-support-oms') {
            c = `Договоры о финансовом обеспечении ОМС`;
            m = `Договор о финансовом обеспечении ОМС`;
        }
        if (type === 'agreement-fin-salaries') {
            c = `Соглашения о софинансировании заработной платы медицинских работников`;
            m = `Соглашение о софинансировании заработной платы медицинских работников`;
        }
        
        this.setState({
            title: c,
            msgTitle: m
        });
        this.props.setTitle(this.state.title);
    }
    
    componentDidUpdate(prevProps, prevState) {
      if (prevProps.match.params.id !== this.props.match.params.id) {
        if (this.props.match.params.id) {
            this.setState({openMessageDialog: true});
        } else {
            this.setState({openMessageDialog: false});
        }
      }
      
      if (prevProps.match.params.type !== this.props.match.params.type) {
        const type = this.props.match.params.type;
        let c = `Соглашения`;
        let m = 'Соглашение';
        if (type === 'agreement-fin') {
            c = `Соглашения`;
            m = 'Соглашение';
        }
        if (type === 'contract-payment-oms') {
            c = `Договоры на оказание и оплату медицинской помощи по ОМС`;
            m = `Договор на оказание и оплату медицинской помощи по ОМС`;
        }
        if (type === 'contract-financial-support-oms') {
            c = `Договоры о финансовом обеспечении ОМС`;
            m = `Договор о финансовом обеспечении ОМС`;
        }
        if (type === 'agreement-fin-salaries') {
            c = `Соглашения о софинансировании заработной платы медицинских работников`;
            m = `Соглашение о софинансировании заработной платы медицинских работников`;
        }
        
        this.setState({
            title: c,
            msgTitle: m
        });
      }
      if (prevState.title !== this.state.title) {
          this.props.setTitle(this.state.title);
      }
    }
  
    handleClickShowItem(id){
        this.props.history.push(`/agreements/list/${this.props.match.params.type}/${id}`);
    }

    handleCloseDialog = () => {
        this.props.history.push(`/agreements/list/${this.props.match.params.type}`);
        this.props.setTitle(this.state.title);
    };
    
    render() {
      const type = this.props.match.params.type;
      
      let columns = createColumns(this.props.statuses, this.handleClickShowItem);
      
      return (
          <div>
            <ContainerStyled maxWidth="lg" >
              <Grid container spacing={3}>
                {/* Recent Orders */}
                <Grid item xs={12}>
                  <PaperStyled>
                    <AgreementFilter msgType={type} />
                    <AgreementList 
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
            <FullScreenDialog title={this.state.msgTitle} open={this.state.openMessageDialog} onClose={this.handleCloseDialog}>
                <AgreementShowMessage setTitle={this.props.setTitle}/>
            </FullScreenDialog>
          </div>
      );
    }
}

const mapStateToProps = function(store, ownProps) {
  const type = ownProps.match.params.type;
  let c = null;
  if (type === 'agreement-fin') {
      c = store.agreementReducer.incoming;
  }
  if (type === 'contract-payment-oms') {
      c = store.agreementReducer.contractPaymentOms;
  }
  if (type === 'contract-financial-support-oms') {
      c = store.agreementReducer.contractFinancialSupportOms;
  }
  if (type === 'agreement-fin-salaries') {
      c = store.agreementReducer.agreementFinSalaries;
  }
  return {
      items: c.items, 
      loading: c.loading,
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


export default connect(mapStateToProps,mapDispatchToProps)(withRouter(AgreementsInMessage));