import React from 'react';
import { withRouter } from "react-router-dom";

import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';

import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import InputLabel from '@mui/material/InputLabel';

import CircularProgress from '@mui/material/CircularProgress';


import UploadFile from '../UploadFile/UploadFile';
import FilesList from '../UploadFile/TempTODOTempTempFilesList';

import SendIcon from '@mui/icons-material/Send';

import { connect } from 'react-redux';

import { userFetch } from '../../store/user/userAction.js'
import { cadesCertFetch } from '../../store/cadesplugin/cadespluginAction.js'

import { fileService } from '../../services';
import { cadespluginService } from '../../services';
import { messageService } from '../../services';

import { fileDownload, textFileDownload } from '../../_helpers';

import CertDialog from '../Dialog/CertDialog';

import { periodFetch } from '../../store/period/periodAction';
import { ContainerStyled } from '../Message/ContainerStyled.js';
import { PaperStyled } from '../Message/PaperStyled.js';

import { BackdropStyled } from '../Message/BackdropStyled.js';
import { ComboboxFormControl } from '../Message/ComboboxFormControl.js';
import { SendButtonWrapper } from '../Message/SendButtonWrapper.js';
import { CircularProgressStyled } from '../Message/CircularProgressStyled.js';

const medCareType = [
    {id:4, name:'app', title:'Поликлиника'},
    {id:5, name:'dd', title:'Диспансеризация'},
    {id:14, name:'ksds', title:'Круглосуточный и дневной стационары'},
    {id:8, name:'vmp', title:'Высокотехнологичная помощь'},
    {id:9, name:'mr', title:'Мед. реабилитация'},
    {id:11, name:'smp', title:'Скорая помощь'}
]

const categoryPs = [
    {id:2, name:'asm', title:'Астрамед'},
    {id:1, name:'kms', title:'Капитал МС'},	 
    {id:3, name:'mtr', title:'МТР'}
]

class BillsNewMessage extends React.Component {
    
    constructor(props){
      super(props);
      
      this.state = {
        msgText: '',
        msgPeriod: '',
        // TODO Получать список msgTo с сервера ИЛИ подстановка на сервере на основе типа сообщения
        msgTo: [11], // Сахатский
        msgFiles: [],
        msgSending: false,
        msgCategoryPs: null,
        msgCategoryMedCareType: '',
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
      this.handleChangePeriod = this.handleChangePeriod.bind(this);
      this.handleOnUploadFile = this.handleOnUploadFile.bind(this);
      this.handleChangeMsgCategoryPs = this.handleChangeMsgCategoryPs.bind(this);
      this.handleChangeMsgCategoryMedCareType = this.handleChangeMsgCategoryMedCareType.bind(this);
      this._handleSubmit = this._handleSubmit.bind(this);
      this.props.setTitle('Отправка счетов');
    }
    
    componentDidMount(){
        // this.props.fetchMyFiles(this.props.page, this.props.perPage);
        this.props.fetchUsers(0, -1);
        this.props.fetchPeriod();
    }
    
    componentDidUpdate(prevProps, prevState) {
      if (prevState.msgPeriod === '' && this.props.periodList.length) {
        let previousMonth = new Date();
        previousMonth.setDate(0);

        let period = this.props.periodList.find((elem, index, arr) => {
            if (elem === undefined) {
                return false;
            }
            let dtFrom = new Date(elem.attributes.from);
            let dtTo   = new Date(elem.attributes.to)
            if (dtFrom <= previousMonth && previousMonth <= dtTo)
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

    handleChangeMsgText(e){
        e.preventDefault();

        let msgText = e.target.value;
        
        this.setState({
            msgText: msgText
        });
    }
    
    handleChangeMsgCategoryPs(e) {
        e.preventDefault();
        let msgCategoryPs = Number.parseInt(e.target.value)
        
        this.setState({
            msgCategoryPs: msgCategoryPs
        });
    };
    
    handleChangeMsgCategoryMedCareType(e) {
        e.preventDefault();
        this.setState({
            msgCategoryMedCareType: e.target.value
        });
    };

    handleChangePeriod = (e) => {
      e.preventDefault();
      this.setState({
          msgPeriod: e.target.value
      });
  }
    
    handleOnUploadFile(file){
        this.setState(state => {
            
          const msgFiles = [...state.msgFiles, file];
     
          return {
            msgFiles
          };
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
        if(!this.state.msgCategoryPs) {
            alert("Выберите категорию (Астрамед/Капитал/МТР)");
            this.setState({
                msgSending: false
            });
            return;
        }
        if(!this.state.msgPeriod) {
          alert("Укажите период");
          this.setState({
              msgSending: false
          });
          return;
      }
        if(!this.state.msgCategoryMedCareType) {
            alert("Выберите вид помощи");
            this.setState({
                msgSending: false
            });
            return;
        }
        if(!this.state.msgFiles.length) {
            alert("Добавьте файлы");
            this.setState({
                msgSending: false
            });
            return;
        }
        
        
        let msg = {};
        msg.subject = "Счета";
        msg.text    = this.state.msgText;
        msg.to      = this.state.msgTo;
        msg.attach  = this.state.msgFiles.map(item => item.id);
        msg.type    = 'bill';
        msg.period  = this.state.msgPeriod;
        msg.category = [this.state.msgCategoryPs, this.state.msgCategoryMedCareType]

        messageService.sendMsg(msg).then(
            () => { 
                this.setState({
                    msgSending: false
                });
                this.props.history.push('/bills/list/bill') 
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
      const { classes } = this.props;

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
              <ContainerStyled maxWidth="lg">
                <Grid container spacing={3}>
                  {/* Recent Orders */}
                  <Grid item xs={12}>
                    <PaperStyled>
                      <Grid container>
                          <Grid item xs={12}>
                            <SendButtonWrapper>
                              <Button 
                                variant="contained"
                                color="primary"
                                type="submit" 
                                disabled={this.state.msgSending}
                                startIcon={<SendIcon />}
                                onClick={(e)=>this._handleSubmit(e)}>Отправить</Button>
                              {this.state.msgSending && <CircularProgressStyled size={24} />}
                            </SendButtonWrapper>
                          </Grid>
                          <Grid item xs={12}> 
                          <form onSubmit={(e)=>this._handleSubmit(e)}>
                            <Grid container>
                                <Grid item xs={12} sm={4}>
                                <ComboboxFormControl variant="standard" component="fieldset">
                                    <RadioGroup aria-label="category" name="msgCategoryPs" value={ this.state.msgCategoryPs } onChange={ this.handleChangeMsgCategoryPs } row>
                                      { categoryPs && (categoryPs).map( (item) => (
                                          <FormControlLabel key={ item.id } value={ item.id } control={<Radio />} label={ item.title } />
                                      ))}
                                    </RadioGroup>
                                </ComboboxFormControl>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <ComboboxFormControl variant="standard" fullWidth>
                                      <InputLabel id='msg-period-label' >Период</InputLabel>
                                      <Select
                                          variant="standard"
                                          fullWidth
                                          labelId="msg-period-label"
                                          id="msg-period"
                                          value={ this.state.msgPeriod }
                                          onChange={ this.handleChangePeriod }>
                                        { periodList && (periodList).map( (item) => (
                                          <MenuItem key={ item.id } value={ item.id }>{ item.attributes.name }</MenuItem>
                                        ))}
                                      </Select>
                                    </ComboboxFormControl>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <ComboboxFormControl variant="standard" fullWidth>
                                      <InputLabel id='msg-category-med-care-type-label' >Вид помощи</InputLabel>
                                      <Select
                                          variant="standard"
                                          fullWidth
                                          labelId="msg-category-med-care-type-label"
                                          id="msg-category-med-care-type"
                                          value={ this.state.msgCategoryMedCareType }
                                          onChange={ this.handleChangeMsgCategoryMedCareType }>
                                        { medCareType && (medCareType).map( (item) => (
                                          <MenuItem key={ item.id } value={ item.id }>{ item.title }</MenuItem>
                                        ))}
                                      </Select>
                                    </ComboboxFormControl>
                                </Grid>
                                
                                <Grid item xs={12}>
                                      <TextField
                                        fullWidth
                                        
                                        id="msg-text"
                                        label="Дополнительная информация (необязательно)"
                                        multiline
                                        rows = {4}
                                        maxRows={20}
                                        value={this.state.msgText}
                                        onChange={this.handleChangeMsgText}
                                        variant="outlined"
                                        margin="normal"
                                      />
                                </Grid>
                                <Grid item xs={12}>
                                  <Typography variant="body1" align="left">
                                    Прикрепленные файлы
                                  </Typography>                          
                              
                                  <CertDialog selectedValue={this.state.certDialogSelectedValue} open={this.state.certDialogOpen} onClose={this.handleCloseCertDialog} />
                                  <FilesList 
                                      items={this.state.msgFiles} 
                                      rowsPerPage={this.state.msgFiles.length} 
                                      page={0} 
                                      loading={this.props.loading} 
                                      getFile={ (url, filename) => { 
                                          fileService.getFile(url).then(
                                              fileBlob => fileDownload(fileBlob, filename),
                                              error    => alert(`Файл не сформирован или доступ к файлу запрещён. Msg: ${error}`)
                                          )}
                                      }
                                      saveFileSignAsBase64={ (result, signFileName) => {
                                              // Скачиваем текстовый файл(base64)
                                              textFileDownload(result,signFileName+'.sig');
                                          }
                                      }
                                      saveFileSignAsBin={ (result, signFileName) => {
                                              fetch('data:application/octet-stream;base64,'+result).then((response) => {
                                                      response.blob().then(blob => {
                                                              // Скачиваем бинарный файл
                                                              fileDownload(blob,signFileName+'.sgn')
                                                      })
                                                  })
                                          }
                                      }
                                      fileSign={this.handleClickSign}
                                      users={this.props.users}
                                   />
                                </Grid>
                            </Grid>
                          </form>
                          </Grid>
                          <Grid item xs={12}>
                          <UploadFile onUploadFile={(result) => this.handleOnUploadFile(result)} />
                          <SendButtonWrapper>
                              <Button 
                                variant="contained"
                                color="primary"
                                type="submit" 
                                disabled={this.state.msgSending}
                                startIcon={<SendIcon />}
                                onClick={(e)=>this._handleSubmit(e)}>Отправить</Button>
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
      periodList: store.periodReducer.items,
      usersLoading: store.userReducer.loading,
    };
}
const mapDispatchToProps = dispatch => {
  return {
    fetchUsers: (page, perPage) => {
        dispatch(userFetch(page, perPage));
    },
    fetchPeriod: () => {
      dispatch(periodFetch(0, -1));
    },
    fetchCert: () => {
        dispatch(cadesCertFetch());
    }
  }
}


export default connect(mapStateToProps,mapDispatchToProps)(withRouter(BillsNewMessage));