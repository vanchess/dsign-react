import React from 'react';
import { withRouter } from "react-router-dom";
//import clsx from 'clsx';
import Autocomplete from '@material-ui/lab/Autocomplete';
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


import UploadFile from '../UploadFile/UploadFileReg';
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
import { periodFetch } from '../../store/period/periodAction.js'

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

class RegisterNewMessage extends React.Component {
    
    constructor(props){
      super(props);
      
      // let period = moment().subtract(1, 'months').local().format("MM.YYYY");
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
      
      this.handleChangePeriod = this.handleChangePeriod.bind(this);
      this.handleChangeMsgText = this.handleChangeMsgText.bind(this);
      this.handleOnUploadFile = this.handleOnUploadFile.bind(this);
      this.handleChangeMsgCategoryPs = this.handleChangeMsgCategoryPs.bind(this);
      this.handleChangeMsgCategoryMedCareType = this.handleChangeMsgCategoryMedCareType.bind(this);
      this._handleSubmit = this._handleSubmit.bind(this);
      this.props.setTitle('Отправка реестров');
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
        msg.subject = "Реестры";
        msg.text    = this.state.msgText;
        msg.to      = this.state.msgTo;
        msg.attach  = this.state.msgFiles.map(item => item.id);
        msg.type    = 'reg';
        msg.category = [this.state.msgCategoryPs, this.state.msgCategoryMedCareType]
        msg.period  = this.state.msgPeriod;
        
        console.log(msg);
        messageService.sendMsg(msg).then(
            () => { 
                this.setState({
                    msgSending: false
                });
                this.props.history.push('/registers/list/reg') 
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
                              <FormControl component="fieldset" className={classes.comboboxFormControl}>
                                  <RadioGroup aria-label="category" name="msgCategoryPs" value={ this.state.msgCategoryPs } onChange={ this.handleChangeMsgCategoryPs } row>
                                    { categoryPs && (categoryPs).map( (item) => (
                                        <FormControlLabel key={ item.id } value={ item.id } control={<Radio />} label={ item.title } />
                                    ))}
                                  </RadioGroup>
                              </FormControl>
                              </Grid>
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
                              <Grid item xs={12} sm={4}>
                                  <FormControl fullWidth className={classes.comboboxFormControl}>
                                    <InputLabel id='msg-category-med-care-type-label' >Вид помощи</InputLabel>
                                    <Select
                                      fullWidth
                                      labelId="msg-category-med-care-type-label"
                                      id="msg-category-med-care-type"
                                      value={ this.state.msgCategoryMedCareType }
                                      onChange={ this.handleChangeMsgCategoryMedCareType }
                                    >
                                      { medCareType && (medCareType).map( (item) => (
                                        <MenuItem key={ item.id } value={ item.id }>{ item.title }</MenuItem>
                                      ))}
                                    </Select>
                                  </FormControl>
                              </Grid>
                              <Grid item xs={12}>
                                    <TextField
                                      fullWidth
                                      
                                      id="msg-text"
                                      label="Дополнительная информация (необязательно)"
                                      multiline
                                      rows = {2}
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
  console.log(store);
  return {
      users: store.userReducer.items,
      usersLoading: store.userReducer.loading,
      periodList: store.periodReducer.items,
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
    fetchCert: () => {
        dispatch(cadesCertFetch());
    }
  }
}


export default connect(mapStateToProps,mapDispatchToProps)(withRouter(withStyles(styles)(RegisterNewMessage)));