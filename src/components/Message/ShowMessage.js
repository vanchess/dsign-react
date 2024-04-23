import React from 'react';
import { withRouter } from "react-router-dom";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';

import FilesList from '../UploadFile/FilesList';

import withStyles from '@mui/styles/withStyles';
import { green } from '@mui/material/colors';

import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

import HowToRegIcon from '@mui/icons-material/HowToReg';
import PictureInPictureAltIcon from '@mui/icons-material/PictureInPictureAlt';

import { connect } from 'react-redux';

// import { myFileFetch } from '../../store/my-file/myFileAction.js'
import { userFetch } from '../../store/user/userAction.js'
import { myFileStartChangeRowPerPage, myFileStartChangePage } from '../../store/pagination/my-file/myFilePaginationAction.js'
import { cadesCertFetch } from '../../store/cadesplugin/cadespluginAction.js'

import { fileService } from '../../services';
import { cadespluginService } from '../../services';
import { messageService } from '../../services';

import { fileDownload, textFileDownload } from '../../_helpers';

import CertDialog from '../Dialog/CertDialog';
import StatusIcon from './StatusIcon';
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
  
  root: {
    display: 'flex',
    alignItems: 'center',
  },
  actionButtonDiv: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start'
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
  buttonSendDiv: {
    textAlign: 'right',
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

class ShowMessage extends React.Component {
    
    certDialogSelectedValue = {};
    signFileId   = null;
    signFileName = '';
    signCreate   = null;
    
    constructor(props){
      super(props);
      
      this.state = {
        msgId: null,
        msgSubject: '',
        msgText: '',
        msgFromId: null,
        msgFrom: '',
        msgTo: [],
        msgFiles: [],
        msgFilesLoading: true,
        msgStatusLabel: '',
        msgStatusName: '',
        loading: false,

        certDialogOpen: false,
        signInProcess: false,
        
        selectedMsgFilesIds: [],
        fileSign: {},
      };
      
      this.handleSelectItem = this.handleSelectItem.bind(this);
      this.handleSelectAllClick = this.handleSelectAllClick.bind(this);
      
      this.props.setTitle('Cообщение');
    }
    
    componentDidMount(){
        // this.props.fetchMyFiles(this.props.page, this.props.perPage);
        this.props.fetchUsers(0, -1);
        let msgId = this.props.match.params.id;
        messageService.get(msgId).then(
            (msg) => {
                messageService.getTo(msgId).then(
                    (toUsers) => this.setState({
                        msgTo: toUsers.data.map((item) => item.attributes.name)
                    })
                );
                
                messageService.getFiles(msgId).then(
                    (files) => {
                        this.setState({
                            msgFiles: files.data,
                            msgFilesLoading: false
                        });
                        // Получаем ЭП файлов
                        files.data.map(item => {
                            fileService.getFileSign(item.id).then((sign) =>
                                {
                                    this.setState((state) => {
                                        let newFileSignArr = { ...(state.fileSign) };
                                        newFileSignArr[item.id]=sign.data;
                                        return {fileSign: newFileSignArr}
                                      });
                                }
                            );
                        });
                    },
                    (error) => this.setState({
                        msgFiles: [],
                        msgFilesLoading: false
                    }),
                );
                
                this.setState({
                    msgSubject: msg.attributes.subject,
                    msgText: msg.attributes.text,
                    msgId:   msg.id,
                    msgFromId: msg.attributes.user_id,
                    msgStatusLabel: msg.relationships.status.data.attributes.lable,
                    msgStatusName:  msg.relationships.status.data.attributes.name,
                });
                //console.log(msg);
            }
        );
    }
    
    componentDidUpdate(prevProps, prevState) {
      if ((prevProps.users.length == 0 || this.state.msgFromId !== prevState.msgFromId) && this.props.users.length !== 0) {
            this.setState((state) => {
                {
                    return {msgFrom: (this.props.users[state.msgFromId] ? this.props.users[state.msgFromId].attributes.name : '')}
                }
            })
      }
    }

    handleClickSignMultiple = () => {
        this.certDialogSelectedValue = {};
        
        this.signCreate = this.fileSignMultipleCreate;
        
        this.setState({
            certDialogOpen: true,
        });
        
        this.props.fetchCert();
    };
    
    handleClickGetFileMultiple = async () => {
        let len = this.state.selectedMsgFilesIds.length;
        // console.log(this.state.selectedMsgFilesIds);
        // console.log(len);
        for(let i = 0; i < len; i++) {
          try {
            let fileId = this.state.selectedMsgFilesIds[i];
            let file = await fileService.getFileStampedByIdWithFilename(fileId);
            fileDownload(file.blob, file.filename);
          } catch(err) {
            console.log(`Error: ${err}`);
          }
        }
    };
    
    fileSignMultipleCreate = async () => {
        this.setState({ signInProcess: true });
        
        let cert = this.certDialogSelectedValue.cert;
        let len = this.state.selectedMsgFilesIds.length;
        // console.log(this.state.selectedMsgFilesIds);
        // console.log(len);
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
          // console.log(newSelecteds);
          return;
        }
        this.setState({selectedMsgFilesIds: []});
    };
   
  
  
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
                          <Grid item xs={10}>
                              <TextField
                                  variant="standard"
                                  fullWidth
                                  readOnly
                                  label="Тема"
                                  id="msg-subject"
                                  value={this.state.msgSubject}
                                  helperText="" />
                          </Grid>
                          <Grid item xs={2}>
                            <Typography variant="body2" align="left" color='textSecondary'>
                                Статус
                            </Typography>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                flexWrap: 'nowrap',
                            }}>
                                <StatusIcon name={this.state.msgStatusName} label={this.state.msgStatusLabel} />
                                {this.state.msgStatusLabel}
                            </div>
                            
                          </Grid>
                          <Grid item xs={12}>
                              <div align="left">
                                <Typography variant="body2" align="left" color='textSecondary'>
                                  От кого
                                </Typography> 
                                <Chip label={this.state.msgFrom}/>
                              </div>
                          </Grid>
                          <Grid item xs={12}>
                              <div align="left">
                                <Typography variant="body2" align="left" color='textSecondary'>
                                  Кому
                                </Typography> 
                                { (this.state.msgTo).map( (toUser) => 
                                    (<Chip key={toUser} label={toUser}/>)
                                )}
                              </div>
                          </Grid>
                          <Grid item xs={12}>
                            {this.state.msgText ? (
                                <TextField
                                  fullWidth
                                  readOnly
                                  id="msg-text"
                                  label="Текст сообщения"
                                  multiline
                                  rows = {4}
                                  maxRows={20}
                                  value={this.state.msgText}
                                  variant="outlined"
                                  margin="normal"
                                />
                            ):null}
                          </Grid>
                          <Grid item xs={12}>
                            <Typography variant="body2" align="left" color='textSecondary'>
                              Прикрепленные файлы
                            </Typography>       
                          </Grid>
                          <Grid item xs={12}>
                            <div className={classes.actionButtonDiv} >
                                <div className={classes.wrapper}>
                                  <Button 
                                    variant="contained"
                                    color="primary"
                                    disabled={(!this.state.selectedMsgFilesIds.length || this.state.signInProcess || this.state.certDialogOpen)}
                                    startIcon={<HowToRegIcon />}
                                    onClick={ this.handleClickSignMultiple }>Подписать ЭП</Button>
                                  <Button 
                                    variant="contained"
                                    color="primary"
                                    disabled={(!this.state.selectedMsgFilesIds.length || this.state.signInProcess || this.state.certDialogOpen)}
                                    startIcon={<PictureInPictureAltIcon />}
                                    onClick={ this.handleClickGetFileMultiple }>Скачать с отметкой об ЭП</Button>
                                  {(this.state.signInProcess || this.state.certDialogOpen) && <CircularProgress size={24} className={classes.buttonProgress} />}
                                </div>
                            </div>
                          </Grid>
                          <Grid item xs={12}>
                        
                            <FilesList 
                                items={this.state.msgFiles} 
                                selectedIds = {this.state.selectedMsgFilesIds}
                                selectAllClick = {this.handleSelectAllClick}
                                selectItem = {this.handleSelectItem}
                                fileSignArray = {this.state.fileSign}
                                rowsPerPage={this.state.msgFiles.length}
                                page={0} 
                                loading={this.state.msgFilesLoading} 
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
                  </Paper>
                </Grid>
              </Grid>
            </Container>
            <CertDialog selectedValue={this.state.certDialogSelectedValue} open={this.state.certDialogOpen} onClose={this.handleCloseCertDialog} />
          </div>
      );
  }
}

const mapStateToProps = function(store) {
  //console.log(store);
  return {
      
      loading: store.myFileReducer.loading,
      users: store.userReducer.items,
      usersLoading: store.userReducer.loading,
    };
}
const mapDispatchToProps = dispatch => {
  return {
    handleChangePage: (event, page) => {
        dispatch(myFileStartChangePage(page));
    },
    handleChangeRowsPerPage: (event) => {
        let perPage = parseInt(event.target.value, 10);
        dispatch(myFileStartChangeRowPerPage(perPage));
    },
    /*
    fetchMyFiles: (page, perPage) => {
        dispatch(myFileFetch(page, perPage));
    },*/
    fetchUsers: (page, perPage) => {
        dispatch(userFetch(page, perPage));
    },
    fetchCert: () => {
        dispatch(cadesCertFetch());
    }
  }
}


export default connect(mapStateToProps,mapDispatchToProps)(withRouter(withStyles(styles)(ShowMessage)));