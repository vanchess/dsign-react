import React from 'react';
import { withRouter } from "react-router-dom";
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';

import CircularProgress from '@mui/material/CircularProgress';


import UploadFileMultiple from '../UploadFile/UploadFileMultiple';
import FilesList from '../UploadFile/FilesList';

import SendIcon from '@mui/icons-material/Send';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

import { connect } from 'react-redux';

import { userFetch } from '../../store/user/userAction.js'
import { cadesCertFetch } from '../../store/cadesplugin/cadespluginAction.js'

import { fileService } from '../../services';
import { cadespluginService } from '../../services';
import { messageService } from '../../services';

import { fileDownload, textFileDownload } from '../../_helpers';

import CertDialog from '../Dialog/CertDialog';
import { CircularProgressStyled } from './CircularProgressStyled.js';
import { BackdropStyled } from './BackdropStyled.js';
import { ContainerStyled } from './ContainerStyled.js';
import { PaperStyled } from './PaperStyled.js';
import { SendButtonWrapper } from './SendButtonWrapper.js';
import { ActionButtonWrapper } from './ActionButtonWrapper.js';


const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

class NewMessage extends React.Component {
    
    certDialogSelectedValue = {};
    signFileId   = null;
    signFileName = '';
    signCreate   = null;
    
    constructor(props){
      super(props);
      
      this.state = {
        msgSubject: '',
        msgText: '',
        msgTo: [],
        msgFiles: [],
        msgSending: false,
        loading: false,

        certDialogOpen: false,
        
        signInProcess: false,
        
        selectedMsgFilesIds: [],
        fileSign: {},
      };
      
      this.handleChangeMsgText = this.handleChangeMsgText.bind(this);
      this.handleChangeMsgSubject = this.handleChangeMsgSubject.bind(this);
      this.handleChangeMsgTo = this.handleChangeMsgTo.bind(this);
      this.handleOnUploadFile = this.handleOnUploadFile.bind(this);
      this._handleSubmit = this._handleSubmit.bind(this);
      this.handleSelectItem = this.handleSelectItem.bind(this);
      this.handleSelectAllClick = this.handleSelectAllClick.bind(this);
      
      this.props.setTitle('Новое сообщение');
    }
    
    componentDidMount(){
        this.props.fetchUsers(0, -1);
    }
    
    handleChangeMsgText(e){
        e.preventDefault();

        let msgText = e.target.value;
        
        this.setState({
            msgText: msgText
        });
    }
    
    handleChangeMsgTo(e, newValue){
        e.preventDefault();      
        this.setState({
            msgTo: newValue
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
            let newFileSignArr = { ...(state.fileSign) };
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
        if(!this.state.msgSubject) {
            alert("Укажите тему сообщения");
            this.setState({
                msgSending: false
            });
            return;
        }
        if(!this.state.msgTo.length) {
            alert("Добавьте получателей");
            this.setState({
                msgSending: false
            });
            return;
        }
        if(!this.state.msgFiles.length && !this.state.msgText) {
            alert("Введите текст сообщения или добавьте файлы");
            this.setState({
                msgSending: false
            });
            return;
        }
        
        let msg = {};
        msg.subject = this.state.msgSubject;
        msg.text    = this.state.msgText;
        msg.to      = this.state.msgTo.map(item => item.id);
        msg.attach  = this.state.msgFiles.map(item => item.id);

        messageService.sendMsg(msg).then(
            () => { 
                this.setState({
                    msgSending: false
                });
                this.props.history.push('/mail/msg/out') 
            },
            (err) => { 
                alert(err);
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
                              {this.state.msgSending && <CircularProgress size={24} />}
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
                                  label="Тема"
                                  id="msg-subject"
                                  value={this.state.msgSubject}
                                  onChange={this.handleChangeMsgSubject}
                                  helperText=""
                                  margin="normal" />
                            </Grid>
                            <Grid item xs={12}>
                                <Autocomplete
                                  fullWidth
                                  multiple
                                  required
                                  id="msg-to"
                                  options={this.props.users}
                                  disableCloseOnSelect
                                  getOptionLabel={(option) => option.attributes.name}
                                  onChange={this.handleChangeMsgTo}
                                  renderOption={(props, option, { selected }) => (
                                    <li {...props} key={option.id}>
                                      <Checkbox
                                        
                                        icon={icon}
                                        checkedIcon={checkedIcon}
                                        style={{ marginRight: 8 }}
                                        checked={selected}
                                      />
                                      {option.attributes.name} ({option.attributes.branch}) ({option.attributes.job_title})
                                    </li>
                                  )}
                                  renderInput={(params) => (
                                    <TextField
                                        variant="standard"
                                        {...params}
                                        label="Кому"
                                        placeholder="Начните вводить имя получателя" />
                                  )}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                    <TextField
                                      fullWidth
                                      
                                      id="msg-text"
                                      label="Текст сообщения"
                                      multiline
                                      minRows = {4}
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
                                <ActionButtonWrapper>
                                      <Button 
                                        variant="contained"
                                        color="primary"
                                        disabled={(!this.state.selectedMsgFilesIds.length || this.state.signInProcess || this.state.certDialogOpen)}
                                        startIcon={<HowToRegIcon />}
                                        onClick={ this.handleClickSignMultiple }>Подписать ЭП</Button>
                                      {(this.state.signInProcess || this.state.certDialogOpen) && <CircularProgressStyled size={24} />}
                                </ActionButtonWrapper>
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
  // console.log(store);
  return {
      users: store.userReducer.items,
      usersLoading: store.userReducer.loading,
    };
}
const mapDispatchToProps = dispatch => {
  return {
    fetchUsers: (page, perPage) => {
        dispatch(userFetch(page, perPage));
    },
    fetchCert: () => {
        dispatch(cadesCertFetch());
    }
  }
}


export default connect(mapStateToProps,mapDispatchToProps)(withRouter(NewMessage));