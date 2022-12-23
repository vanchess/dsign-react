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

import FormGroup from '@material-ui/core/FormGroup';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import FormHelperText from '@material-ui/core/FormHelperText';

import CircularProgress from '@material-ui/core/CircularProgress';


import UploadFileMultiple from '../UploadFile/UploadFileMultiple';
import FilesList from '../UploadFile/FilesList';

import { withStyles } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';

import SendIcon from '@material-ui/icons/Send';
import HowToRegIcon from '@material-ui/icons/HowToReg';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';

import { connect } from 'react-redux';

// import { myFileFetch } from '../../store/my-file/myFileAction.js'
import { userFetch } from '../../store/user/userAction.js'
import { cadesCertFetch } from '../../store/cadesplugin/cadespluginAction.js'

import { fileService } from '../../services';
import { cadespluginService } from '../../services';
import { messageService } from '../../services';

import { fileDownload, textFileDownload } from '../../_helpers';

import CertDialog from '../Dialog/CertDialog';

import moment from 'moment';
import { MenuItem, Select } from '@material-ui/core';
import { periodFetch } from '../../store/period/periodAction';
import { organizationFetch } from '../../store/organization/organizationAction';

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
  
  actionButtonDiv: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start'
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
})

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const filterOrganizationOptions = createFilterOptions({
  stringify: (option) => option.attributes.short_name + option.attributes.name,
});


class ReconciliationActNewMessage extends React.Component {
    
    certDialogSelectedValue = {};
    signFileId   = null;
    signFileName = '';
    signCreate   = null;
    
    constructor(props){
      super(props);
      
      let period = moment().subtract(1, 'months').local().format("MM.YYYY");
      this.state = {
        msgSubject: `Акты сверки`,
        msgText: '',
        msgTo: [11],
        msgFiles: [],
        msgSending: false,
        msgPeriod: '',
        loading: false,

        certDialogOpen: false,
        
        signInProcess: false,
        
        selectedMsgFilesIds: [],
        fileSign: [],
      };
      
      this.handleChangeMsgText = this.handleChangeMsgText.bind(this);
      this.handleChangeMsgSubject = this.handleChangeMsgSubject.bind(this);
      this.handleOnUploadFile = this.handleOnUploadFile.bind(this);
      this._handleSubmit = this._handleSubmit.bind(this);
      this.handleSelectItem = this.handleSelectItem.bind(this);
      this.handleSelectAllClick = this.handleSelectAllClick.bind(this);
      this.handleChangePeriod = this.handleChangePeriod.bind(this);
      this.handleChangeMsgToOrg = this.handleChangeMsgToOrg.bind(this);

      this.props.setTitle('Отправка актов сверки');
    }
    
    componentDidMount(){
        // this.props.fetchMyFiles(this.props.page, this.props.perPage);
        this.props.fetchUsers(0, -1);
        this.props.fetchPeriod();
        this.props.fetchOrganization();
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

    handleChangePeriod = (e) => {
      e.preventDefault();
      this.setState({
          msgPeriod: e.target.value
      });
    }
    
    handleChangeMsgText(e){
        e.preventDefault();

        let msgText = e.target.value;
        
        this.setState({
            msgText: msgText
        });
    }
    
    handleChangeMsgToOrg(e, newValue){
      e.preventDefault();      
      this.setState({
          msgToOrg: newValue
      });
    }
    
    handleChangeMsgSubject(e){
        e.preventDefault();

        let msgSubject = e.target.value;
        
        this.setState({
            msgSubject: msgSubject
        });
    }
    
    handleOnUploadFile(files){
        this.setState(state => {
            
          const msgFiles = [...state.msgFiles, ...files];
          //state.msgFiles.concat(file);
     
          return {
            msgFiles
          };
        });
    }
    
    handleClickSignMultiple = () => {
        this.certDialogSelectedValue = {};
        
        this.signCreate = this.fileSignMultipleCreate;
        
        this.setState({
            certDialogOpen: true,
        });
        
        this.props.fetchCert();
    };
    
    fileSignMultipleCreate = async () => {

        this.setState({ signInProcess: true });
        
        let cert = this.certDialogSelectedValue.cert;
        let len = this.state.selectedMsgFilesIds.length;
        for(let i = 0; i < len; i++) {
          try {
            let fileId = this.state.selectedMsgFilesIds[i];
            let fileBlob = await fileService.getFileById(fileId);
            let signBase64String = await cadespluginService.FileSignCreate(cert, fileBlob);
            // Сохраняем подпись на сервере
            let sign = await fileService.saveFileSign(fileId, {'base64':signBase64String});
            
            this.addFileSign(fileId, sign);
          } catch(err) {
            console.log(`Error: ${err}`);
          }
        }
        
        this.setState({ signInProcess: false });
    }
    
    handleClickSign = (file) => {
        this.certDialogSelectedValue = {};
        this.signFileId   = file.id;
        this.signFileName = file.attributes.name;
        
        this.signCreate = this.fileSignCreate;
        
        this.setState({
            certDialogOpen: true,
        });
        
        this.props.fetchCert();
    };
    
    addFileSign(fileId, sign) {
        this.setState((state) => {
            let newFileSignArr = state.fileSign;
            if (state.fileSign[fileId]) {
                newFileSignArr[fileId]=[...(state.fileSign[fileId]), sign];
            } else {
                newFileSignArr[fileId]=[sign];
            }
            return {fileSign: newFileSignArr}
          });
    }

    handleCloseCertDialog = (value) => {
        this.certDialogSelectedValue = value
        
        this.setState({
            certDialogOpen: false,
        });
        
        if(!this.certDialogSelectedValue || !this.certDialogSelectedValue.cert) return;
        
        this.signCreate();
    };
    
    fileSignCreate = () => {
        this.setState({ signInProcess: true });
        
        let fileId = this.signFileId;
        
        fileService.getFileById(fileId).then(
            (fileBlob) => {
                cadespluginService.FileSignCreate(this.certDialogSelectedValue.cert, fileBlob).then(
                    (result) => {
                        // Сохраняем подпись на сервере
                        fileService.saveFileSign(fileId, {
                                'base64':result
                            }).then((sign) => {
                                this.addFileSign(fileId, sign);
                                
                                this.setState({ signInProcess: false });
                            });
                    },
                    (error) => {
                        this.setState({ signInProcess: false });
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
        if(!this.state.msgPeriod) {
          alert("Укажите период");
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
        
        let msgType = this.props.match.params.type;
        
        let msg = {};
        msg.subject = this.state.msgSubject;
        msg.text    = this.state.msgText;
        msg.to      = this.state.msgTo;
        msg.toOrg   = [this.state.msgToOrg.id];
        msg.attach  = this.state.msgFiles.map(item => item.id);
        msg.period  = this.state.msgPeriod;
        msg.type    = msgType;
        //console.log(msg);
        messageService.sendMsg(msg).then(
            () => { 
                this.setState({
                    msgSending: false
                });
                this.props.history.push('/bills/list/' + msgType) 
            },
            (err) => { 
                alert(err.error);
                this.setState({
                    msgSending: false
                });
            } 
        );
    }
    
    handleSelectItem = (event, id) => {
        this.setState((state) => {
            const selectedIndex = state.selectedMsgFilesIds.indexOf(id);
            let newSelected = [];

            if (selectedIndex === -1) {
              newSelected = newSelected.concat(state.selectedMsgFilesIds, id);
            } else if (selectedIndex === 0) {
              newSelected = newSelected.concat(state.selectedMsgFilesIds.slice(1));
            } else if (selectedIndex === state.selectedMsgFilesIds.length - 1) {
              newSelected = newSelected.concat(state.selectedMsgFilesIds.slice(0, -1));
            } else if (selectedIndex > 0) {
              newSelected = newSelected.concat(
                state.selectedMsgFilesIds.slice(0, selectedIndex),
                state.selectedMsgFilesIds.slice(selectedIndex + 1),
              );
            }

            return {selectedMsgFilesIds: newSelected};
        });   
    };
    
    handleSelectAllClick = (event) => {
       if (event.target.checked) {
          const newSelecteds = this.state.msgFiles.map((n) => n.id);
         
          this.setState({selectedMsgFilesIds: newSelecteds});
          return;
        }
        this.setState({selectedMsgFilesIds: []});
    };
  
  
  render() {
      const { classes } = this.props;
      //const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

      const periodList = this.props.periodList.slice().sort(function(a, b) {
        if (a.attributes.from < b.attributes.from) {
          return 1; }
        if (a.attributes.from > b.attributes.from) {
          return -1; }
        return 0;
      });

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
                            <Grid item xs={12} sm={4}>
                                <FormControl fullWidth className={classes.comboboxFormControl}>
                                  <InputLabel id='msg-period-label' >Период</InputLabel>
                                  <Select
                                    fullWidth
                                    labelId="msg-period-label"
                                    id="msg-period"
                                    value={ this.state.msgPeriod }
                                    onChange={ this.handleChangePeriod }
                                  >
                                    { periodList && (periodList).map( (item) => (
                                      <MenuItem key={ item.id } value={ item.id }>{ item.attributes.name }</MenuItem>
                                    ))}
                                  </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={8}>
                                <Autocomplete
                                  fullWidth
                                  required
                                  id="msg-to-org"
                                  options={this.props.organizationList.sort((a,b) => { if (a.attributes.short_name > b.attributes.short_name) return 1;  if (a.attributes.short_name < b.attributes.short_name) return -1; return 0;})}
                                  getOptionLabel={(option) => (option.attributes.short_name)}
                                  filterOptions={filterOrganizationOptions}
                                  onChange={this.handleChangeMsgToOrg}
                                  renderOption={(option, { selected }) => (
                                    <React.Fragment>
                                      {option.attributes.short_name}
                                    </React.Fragment>
                                  )}
                                  renderInput={(params) => (
                                    <TextField {...params} label="Организация" placeholder="Начните вводить название организации" />
                                  )}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                    <TextField
                                      fullWidth
                                      
                                      id="msg-text"
                                      label="Текст сообщения"
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
                                <div className={classes.actionButtonDiv} >
                                    <div className={classes.wrapper}>
                                      <Button 
                                        variant="contained"
                                        color="primary"
                                        disabled={(!this.state.selectedMsgFilesIds.length || this.state.signInProcess || this.state.certDialogOpen)}
                                        startIcon={<HowToRegIcon />}
                                        onClick={ this.handleClickSignMultiple }>Подписать ЭП</Button>
                                      {(this.state.signInProcess || this.state.certDialogOpen) && <CircularProgress size={24} className={classes.buttonProgress} />}
                                    </div>
                                </div>
                                <CertDialog open={this.state.certDialogOpen} onClose={this.handleCloseCertDialog} />
                                <FilesList 
                                    items = {this.state.msgFiles}
                                    selectedIds = {this.state.selectedMsgFilesIds}
                                    selectAllClick = {this.handleSelectAllClick}
                                    selectItem = {this.handleSelectItem}
                                    fileSignArray = {this.state.fileSign}
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
                        <UploadFileMultiple onUploadFile={(result) => this.handleOnUploadFile(result)} />
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
  // console.log(store);
  return {
      users: store.userReducer.items,
      usersLoading: store.userReducer.loading,
      periodList: store.periodReducer.items,
      organizationList: store.organizationReducer.items,
    };
}
const mapDispatchToProps = dispatch => {
  return {
    /*
    handleChangePage: (event, page) => {
        dispatch(myFileStartChangePage(page));
    },
    handleChangeRowsPerPage: (event) => {
        let perPage = parseInt(event.target.value, 10);
        dispatch(myFileStartChangeRowPerPage(perPage));
    },
    fetchMyFiles: (page, perPage) => {
        dispatch(myFileFetch(page, perPage));
    },*/
    fetchUsers: (page, perPage) => {
        dispatch(userFetch(page, perPage));
    },
    fetchPeriod: () => {
      dispatch(periodFetch(0, -1));
    },
    fetchOrganization: () => {
      dispatch(organizationFetch(0, -1));
    },
    fetchCert: () => {
        dispatch(cadesCertFetch());
    }
  }
}


export default connect(mapStateToProps,mapDispatchToProps)(withRouter(withStyles(styles)(ReconciliationActNewMessage)));