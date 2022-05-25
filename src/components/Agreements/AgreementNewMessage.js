import React from 'react';
import { withRouter } from "react-router-dom";
//import clsx from 'clsx';
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete';
import Backdrop from '@material-ui/core/Backdrop';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';

import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

import FormGroup from '@material-ui/core/FormGroup';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import FormHelperText from '@material-ui/core/FormHelperText';

import CircularProgress from '@material-ui/core/CircularProgress';


import UploadFile from '../UploadFile/UploadFile';
import FilesList from '../UploadFile/TempTODOTempTempFilesList';

import { withStyles } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';

import SendIcon from '@material-ui/icons/Send';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';

import { connect } from 'react-redux';

// import { myFileFetch } from '../../store/my-file/myFileAction.js'
import { userFetch } from '../../store/user/userAction.js'
import { cadesCertFetch } from '../../store/cadesplugin/cadespluginAction.js'
import { organizationFetch } from '../../store/organization/organizationAction.js'

import { fileService } from '../../services';
import { cadespluginService } from '../../services';
import { messageService } from '../../services';

import { fileDownload, textFileDownload } from '../../_helpers';

import CertDialog from '../Dialog/CertDialog';

import moment from 'moment';

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
  
  buttonSendDiv: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end'
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
  //fixedHeight: {
  //  height: 240,
  //},
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
  comboboxFormControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
})

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const filterOrganizationOptions = createFilterOptions({
    stringify: (option) => option.attributes.short_name + option.attributes.name,
});

class AgreementNewMessage extends React.Component {
    
    constructor(props){
      super(props);

      this.state = {
        msgSubject: `Соглашение`,
        msgText: '',
        msgTo: [11],
        msgToOrg: null,
        msgFiles: [],
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
      this.handleOnUploadFile = this.handleOnUploadFile.bind(this);
      this.handleChangeMsgToOrg = this.handleChangeMsgToOrg.bind(this);
      this._handleSubmit = this._handleSubmit.bind(this);
      this.props.setTitle('Новое сообщение');
    }
    
    componentDidMount(){
        // this.props.fetchMyFiles(this.props.page, this.props.perPage);
        this.props.fetchUsers(0, -1);
        this.props.fetchOrganization();
        
        const type = this.props.match.params.type;
        let c = `Соглашение`;
        if (type === 'agreement-fin') {
            c = `Соглашения о финансовом обеспечении мероприятий по организации дополнительного профессионального образования медицинских работников по программам повышения квалификации, а также по приобретению и проведению ремонта медицинского оборудования`;
        }
        if (type === 'contract-payment-oms') {
            c = `Договор на оказание и оплату медицинской помощи по ОМС`;
        }
        if (type === 'contract-financial-support-oms') {
            c = `Договор о финансовом обеспечении ОМС`;
        }
        if (type === 'agreement-fin-salaries') {
            c = `Соглашения о софинансировании заработной платы медицинских работников`;
        }
        
        this.setState({
            msgSubject: c
        });
    }
    
    componentDidUpdate(prevProps, prevState) {
      if (prevProps.match.params.type !== this.props.match.params.type) {
        const type = this.props.match.params.type;
        let c = `Соглашение`;
        if (type === 'agreement-fin') {
            c = `Соглашения о финансовом обеспечении мероприятий по организации дополнительного профессионального образования медицинских работников по программам повышения квалификации, а также по приобретению и проведению ремонта медицинского оборудования`;
        }
        if (type === 'contract-payment-oms') {
            c = `Договор на оказание и оплату медицинской помощи по ОМС`;
        }
        if (type === 'contract-financial-support-oms') {
            c = `Договор о финансовом обеспечении ОМС`;
        }
        if (type === 'agreement-fin-salaries') {
            c = `Соглашения о софинансировании заработной платы медицинских работников`;
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

    handleChangeMsgToOrg(e, newValue){
        e.preventDefault();      
        this.setState({
            msgToOrg: newValue
        });
    }
    
    handleOnUploadFile(file){
        this.setState(state => {
            
          const msgFiles = [...state.msgFiles, file];
          //state.msgFiles.concat(file);
     
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
        if(!this.state.msgSubject) {
            alert("Укажите тему сообщения");
            this.setState({
                msgSending: false
            });
            return;
        }
        
        if(!this.state.msgToOrg) {
            alert("Добавьте получателя");
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
        msg.subject = this.state.msgSubject;
        msg.text    = this.state.msgText;
        msg.to      = this.state.msgTo;
        msg.toOrg   = [this.state.msgToOrg.id];
        msg.attach  = this.state.msgFiles.map(item => item.id);
        msg.type    = this.props.match.params.type;

        console.log(msg);
        messageService.sendMsg(msg).then(
            () => { 
                this.setState({
                    msgSending: false
                });
                this.props.history.push(`/agreements/list/${msg.type}`) 
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
      //const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
        
      return (
        <div>
            <Backdrop className={classes.backdrop} open={this.state.signInProcess}>
              <CircularProgress color="inherit" />
            </Backdrop>
            <Container maxWidth="lg" className={classes.container}>
              <Grid container spacing={3}>
                {/* Recent Orders */}
                <Grid item xs={12}>
                  <Paper className={classes.paper}>
                    <Grid container>
                        <Grid item xs={12}>
                        <div className={classes.buttonSendDiv} >
                          <div className={classes.wrapper}>
                              <Button 
                                variant="contained"
                                color="primary"
                                type="submit" 
                                disabled={this.state.msgSending}
                                startIcon={<SendIcon />}
                                onClick={(e)=>this._handleSubmit(e)}>Отправить</Button>
                              {this.state.msgSending && <CircularProgress size={24} className={classes.buttonProgress} />}
                          </div>
                        </div>
                        </Grid>
                        <Grid item xs={12}> 
                        <form onSubmit={(e)=>this._handleSubmit(e)}>
                          <Grid container>
                              <Grid item xs={12}>
                              <TextField
                                fullWidth
                                required
                                label="Тема"
                                id="msg-subject"
                                value={this.state.msgSubject}
                                onChange={this.handleChangeMsgSubject}
                                
                                helperText=""
                                margin="normal"
                              />
                              </Grid>
                              <Grid item xs={12}>
                                <Autocomplete
                                  fullWidth
                                  required
                                  id="msg-to-org"
                                  options={this.props.organizationList}
                                  getOptionLabel={(option) => (option.attributes.short_name)}
                                  filterOptions={filterOrganizationOptions}
                                  onChange={this.handleChangeMsgToOrg}
                                  renderOption={(option, { selected }) => (
                                    <React.Fragment>
                                      {option.attributes.short_name}
                                    </React.Fragment>
                                  )}
                                  renderInput={(params) => (
                                    <TextField {...params} label="Куда" placeholder="Начните вводить название организации" />
                                  )}
                                />
                            </Grid>
                              <Grid item xs={12}>
                                    <TextField
                                      fullWidth
                                      
                                      id="msg-text"
                                      label="Дополнительная информация (необязательно)"
                                      multiline
                                      rows = {4}
                                      rowsMax={20}
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
                        <div className={classes.buttonSendDiv} >
                            <div className={classes.wrapper}>
                              <Button 
                                variant="contained"
                                color="primary"
                                type="submit" 
                                disabled={this.state.msgSending}
                                startIcon={<SendIcon />}
                                onClick={(e)=>this._handleSubmit(e)}>Отправить</Button>
                              {this.state.msgSending && <CircularProgress size={24} className={classes.buttonProgress} />}
                            </div>
                        </div>
                        </Grid>
                    </Grid>
                  </Paper>
                </Grid>
              </Grid>
            </Container>
        </div>
      );
  }
}

const mapStateToProps = function(store) {
  return {
      users: store.userReducer.items,
      usersLoading: store.userReducer.loading,
      organizationList: store.organizationReducer.items,
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
  }
}


export default connect(mapStateToProps,mapDispatchToProps)(withRouter(withStyles(styles)(AgreementNewMessage)));