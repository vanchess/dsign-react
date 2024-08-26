import React from 'react';
import { withRouter } from "react-router-dom";
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';

import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';

import CircularProgress from '@mui/material/CircularProgress';

import PostAddIcon from '@mui/icons-material/PostAdd';

import { connect } from 'react-redux';

import { userFetch } from '../../store/user/userAction.js'
import { cadesCertFetch } from '../../store/cadesplugin/cadespluginAction.js'
import { organizationFetch } from '../../store/organization/organizationAction.js'

import { fileService } from '../../services';
import { cadespluginService } from '../../services';
import { messageService } from '../../services';

import { periodFetch } from '../../store/period/periodAction.js';
import { Typography } from '@mui/material';
import { BackdropStyled } from '../Message/BackdropStyled.js';
import { ContainerStyled } from '../Message/ContainerStyled.js';
import { PaperStyled } from '../Message/PaperStyled.js';
import { SendButtonWrapper } from '../Message/SendButtonWrapper.js';
import { CircularProgressStyled } from '../Message/CircularProgressStyled.js';
import { ComboboxFormControl } from '../Message/ComboboxFormControl.js';

class DispListNewMessage extends React.Component {
    
    constructor(props){
      super(props);

      this.state = {
        msgSubject: ``,
        msgText: '',
        msgTo: [11],
        msgPeriod: '',
        msgSending: false,
        loading: false,

        certDialogOpen: false,
        certDialogSelectedValue: {},
        signFileId: null,
        signFileUrl: '',
        signFileName: '',
        signInProcess: false,
        
        handleAddFileSign: null
      };
      
      this.handleChangeMsgText = this.handleChangeMsgText.bind(this);
      this.handleChangeMsgSubject = this.handleChangeMsgSubject.bind(this);
      this.handleChangePeriod = this.handleChangePeriod.bind(this);
      this._handleSubmit = this._handleSubmit.bind(this);
      this.props.setTitle('Новое сообщение');
    }
    
    componentDidMount(){
        this.props.fetchUsers(0, -1);
        this.props.fetchOrganization();
        this.props.fetchPeriod();
        
        const type = this.props.match.params.type;
        let c = ``;
        if (type === 'displist') {
            c = ``;
        }
        
        this.setState({
            msgSubject: c
        });
    }
    
    componentDidUpdate(prevProps, prevState) {
      if (prevProps.match.params.type !== this.props.match.params.type) {
        const type = this.props.match.params.type;
        let c = ``;
        if (type === 'displist') {
            c = ``;
        }
        
        this.setState({
            msgSubject: c
        });
      }
    }
    
    handleChangeMsgText(e){
        e.preventDefault();

        let msgText = e.target.value;
        
        this.setState({
            msgText: msgText
        });
    }
    
    handleChangeMsgSubject(e){
        e.preventDefault();

        let msgSubject = e.target.value;
        
        this.setState({
            msgSubject: msgSubject
        });
    }

    handleChangePeriod = (e) => {
      e.preventDefault();
      this.setState({
          msgPeriod: e.target.value
      });
    }
    
    handleClickSign = (file, handleAddFileSign) => {
        this.setState({
            certDialogOpen: true,
            certDialogSelectedValue: {},
            signFileId: file.id,
            signFileUrl: file.attributes.link,
            signFileName: file.attributes.name,
            handleAddFileSign: handleAddFileSign
        });
        
        this.props.fetchCert();
    };

    componentDidUpdate(prevProps, prevState) {
      if (prevState.msgPeriod === '' && this.props.periodList.length) {
        let now = Date.now();

        let period = this.props.periodList.find((elem, index, arr) => {
            if (elem === undefined) {
                return false;
            }
            let dtFrom = new Date(elem.attributes.from);
            let dtTo   = new Date(elem.attributes.to)
            if (dtFrom <= now && now <= dtTo)
            {
                return true;
            }
            return false;
        });
        this.setState({
            msgPeriod: period.id
        });
      }
    }

    handleCloseCertDialog = (value) => {
        this.setState({
            certDialogOpen: false,
            certDialogSelectedValue: value
        });
        
        if(!value.cert) return;
        
        this.setState({
             signInProcess: true
        });
        
        let {signFileId, signFileUrl, signFileName, handleAddFileSign} = this.state;

        fileService.getFile(signFileUrl).then(
            (fileBlob) => {
                cadespluginService.FileSignCreate(value.cert, fileBlob).then(
                    (result) => {
                        // Сохраняем подпись на сервере
                        fileService.saveFileSign(signFileId, {
                                'base64':result
                            }).then((sign) => {
                                handleAddFileSign(sign);
                                this.setState({signInProcess: false});
                            });
                        
                    },
                    (error) => {
                        this.setState({
                            signInProcess: false
                        });
                        console.log(`Error: ${error}`);
                    });
            }
        )
    };
    
    sendMsg = (msg) => {
        messageService.sendMsg(msg);
    }
    
    _handleSubmit = () => {
        this.setState({
            msgSending: true
        });
        if(!this.state.msgSubject) {
            alert("Укажите организацию от которой лица направляются на проф.мероприятия");
            this.setState({
                msgSending: false
            });
            return;
        }
        if(!this.state.msgPeriod) {
          alert("Укажите период проведения мероприятия");
          this.setState({
              msgSending: false
          });
          return;
        }
        if(!this.state.msgText) {
          alert("Заполните место проведения мероприятия");
          this.setState({
            msgSending: false
          });
          return;
        }
        
        
        let msg = {};
        msg.subject = this.state.msgSubject;
        msg.text    = this.state.msgText;
        msg.to      = this.state.msgTo;
        msg.period  = this.state.msgPeriod;
        msg.type    = this.props.match.params.type;

        messageService.sendMsg(msg).then(
            (data) => { 
                this.setState({
                    msgSending: false
                });
                this.props.history.push(`/displist/list/${msg.type}/${data.id}`) 
            },
            (err) => { 
                alert(err);
                this.setState({
                    msgSending: false
                });
            } 
        );
    }
  
  
  
  render() {
      const periodList = this.props.periodList.slice().sort(function(a, b) {
        if (a.attributes.from < b.attributes.from) {
          return 1; }
        if (a.attributes.from > b.attributes.from) {
          return -1; }
        return 0;
      });

      return (
          <div>
              <BackdropStyled open={this.state.signInProcess}>
                <CircularProgress color="inherit" />
              </BackdropStyled>
              <ContainerStyled maxWidth="lg" >
                <Grid container spacing={3}>
                  {/* Recent Orders */}
                  <Grid item xs={12}>
                    <PaperStyled >
                      <Grid container>
                          <Grid item xs={12}>
                          <SendButtonWrapper>
                                <Button 
                                  variant="contained"
                                  color="primary"
                                  type="submit" 
                                  disabled={this.state.msgSending}
                                  startIcon={<PostAddIcon />}
                                  onClick={(e)=>this._handleSubmit(e)}>Создать список</Button>
                                {this.state.msgSending && <CircularProgressStyled size={24} />}
                          </SendButtonWrapper>
                          </Grid>
                          <Grid item xs={12}> 
                          <form onSubmit={(e)=>this._handleSubmit(e)}>
                            <Grid container>
                                <Grid item xs={12}>
                                <TextField
                                    variant="standard"
                                    fullWidth
                                    required
                                    label="Организация"
                                    id="msg-subject"
                                    value={this.state.msgSubject}
                                    onChange={this.handleChangeMsgSubject}
                                    helperText=""
                                    margin="normal" />
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <ComboboxFormControl variant="standard" fullWidth>
                                      <InputLabel id='msg-period-label' >Период проведения мероприятия</InputLabel>
                                      <Select
                                          variant="standard"
                                          fullWidth
                                          labelId="msg-period-label"
                                          id="msg-period"
                                          value={ this.state.msgPeriod }
                                          onChange={ this.handleChangePeriod }>
                                        { periodList && (periodList).filter(p => Date.parse(p.attributes.to) > Date.now()).map( (item) => (
                                          <MenuItem key={ item.id } value={ item.id }>{ item.attributes.name }</MenuItem>
                                        ))}
                                      </Select>
                                    </ComboboxFormControl>
                                </Grid>
                                <Grid item xs={12} sm={8}>
                                  <Typography color="secondary.dark">Завершить редактирование списка и подписать его электронной подписью необходимо не позднее последнего дня указанного периода. В противном случае список будет отклонен.</Typography>
                                </Grid>
                                <Grid item xs={12}>
                                      <TextField
                                        fullWidth
                                        required
                                        id="msg-text"
                                        label="Место проведения мероприятия"
                                        multiline
                                        minRows = {2}
                                        maxRows={20}
                                        value={this.state.msgText}
                                        onChange={this.handleChangeMsgText}
                                        variant="outlined"
                                        margin="normal"
                                      />
                                </Grid>
                            </Grid>
                          </form>
                          </Grid>
                          <Grid item xs={12}>
                            <SendButtonWrapper>
                                <Button 
                                  variant="contained"
                                  color="primary"
                                  type="submit" 
                                  disabled={this.state.msgSending}
                                  startIcon={<PostAddIcon />}
                                  onClick={(e)=>this._handleSubmit(e)}>Создать список</Button>
                                {this.state.msgSending && <CircularProgressStyled size={24} />}
                            </SendButtonWrapper>
                          </Grid>
                      </Grid>
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
      users: store.userReducer.items,
      usersLoading: store.userReducer.loading,
      organizationList: store.organizationReducer.items,
      periodList: store.periodReducer.items,
    };
}
const mapDispatchToProps = dispatch => {
  return {
    fetchUsers: (page, perPage) => {
        dispatch(userFetch(page, perPage));
    },
    fetchCert: () => {
        dispatch(cadesCertFetch());
    },
    fetchOrganization: () => {
        dispatch(organizationFetch(0, -1));
    },
    fetchPeriod: () => {
      dispatch(periodFetch(0, -1));
    },
  }
}


export default connect(mapStateToProps,mapDispatchToProps)(withRouter(DispListNewMessage));