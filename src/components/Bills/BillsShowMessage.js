import React from 'react';
import { withRouter } from "react-router-dom";

import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';

import ThumbDownAltOutlinedIcon from '@mui/icons-material/ThumbDownAltOutlined';

import { connect } from 'react-redux';

import ShowMessage from '../Message/ShowMessage';
import SendIcon from '@mui/icons-material/Send';

import { messageService } from '../../services';

import { messageFetch } from '../../store/bill/messageInAction.js'
import { ShowMessagePaperStyled } from '../Message/ShowMessagePaperStyled.js';
import { ShowMessageContainerStyled } from '../Message/ShowMessageContainerStyled.js';


class BillsShowMessage extends React.Component {

    constructor(props){
      super(props);
      
      this.handleReject = this.handleReject.bind(this);
    }
    
    fetchMessages = () => {
        this.props.fetchMessages(
            0, 
            -1, 
            this.props.filterStatus.map(item => item.attributes.name), 
            this.props.filterPeriod.map(item => item.id),
            this.props.filterOrganization.map(item => item.id),
          );
    }

    handleReject = () => {
        let msgId = this.props.match.params.id;
        messageService.setStatus(msgId, 'rejected').then(
            () => { 
                this.fetchMessages();
                this.props.history.push('/bills/list/bill') 
            },
            (err) => { 
                alert(err);
            } 
        );
    }
    
    handleSendSmo = () => {
        let msgId = this.props.match.params.id;
        messageService.setStatus(msgId, 'sent-to-smo').then(
            () => { 
                this.fetchMessages();
                this.props.history.push('/bills/list/bill'); 
            },
            (err) => { 
                alert(err);
            } 
        );
    }
  
  
  render() {

      return (
        <div>
        {(this.props.permission && (this.props.permission.includes('reject bill') || this.props.permission.includes('sent-to-smo bill'))) ?
          (<ShowMessageContainerStyled maxWidth="lg">
              <Grid container spacing={3}>
                {/* Recent Orders */}
                <Grid item xs={12}>
                  <ShowMessagePaperStyled>
                      {(this.props.permission.includes('reject bill')) &&
                      <Button 
                        variant="contained"
                        color="primary"
                        startIcon={<ThumbDownAltOutlinedIcon />}
                        onClick={this.handleReject}>Отклонить</Button>
                      }
                      {(this.props.permission.includes('sent-to-smo bill')) &&
                      <Button 
                        variant="contained"
                        color="primary"
                        startIcon={<SendIcon />}
                        onClick={this.handleSendSmo}>Отправить СМО</Button>
                      }
                  </ShowMessagePaperStyled>
                </Grid>
              </Grid>
          </ShowMessageContainerStyled>):null
        }
          <ShowMessage setTitle={this.props.setTitle} />
        </div>
      );
  }
}

const mapStateToProps = function(store) {
  return {
        permission: store.authReducer.user.permissions,
        filterPeriod: store.filtersReducer.bill.period,
        filterStatus: store.filtersReducer.bill.status,
        filterOrganization: store.filtersReducer.bill.organization,
    };
}
const mapDispatchToProps = dispatch => {
  return {
    fetchMessages: (page, perPage, status = [], period = [], org = []) => {
        dispatch(messageFetch(page, perPage, status, period, org));
    },
  }
}


export default connect(mapStateToProps,mapDispatchToProps)(withRouter(BillsShowMessage));