import React from 'react';
import { withRouter } from "react-router-dom";
import Backdrop from '@mui/material/Backdrop';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';

import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';

import CircularProgress from '@mui/material/CircularProgress';

import withStyles from '@mui/styles/withStyles';
import { green } from '@mui/material/colors';

import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import PostAddIcon from '@mui/icons-material/PostAdd';

import { connect } from 'react-redux';

// import { myFileFetch } from '../../store/my-file/myFileAction.js'
import { userFetch } from '../../store/user/userAction.js'
import { cadesCertFetch } from '../../store/cadesplugin/cadespluginAction.js'
import { organizationFetch } from '../../store/organization/organizationAction.js'

import { fileService } from '../../services';
import { cadespluginService } from '../../services';
import { messageService } from '../../services';

import { periodFetch } from '../../store/period/periodAction.js';

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

class DispListNewMessage extends React.Component {
    
    constructor(props){
      super(props);

      this.state = {
        msgSubject: `Список сотрудников на проф.мероприятия`,
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
        // this.props.fetchMyFiles(this.props.page, this.props.perPage);
        this.props.fetchUsers(0, -1);
        this.props.fetchOrganization();
        this.props.fetchPeriod();
        
        const type = this.props.match.params.type;
        let c = `Список сотрудников на проф.мероприятия`;
        if (type === 'displist') {
            c = `Список сотрудников на проф.мероприятия`;
        }
        
        this.setState({
            msgSubject: c
        });
    }
    
    componentDidUpdate(prevProps, prevState) {
      if (prevProps.match.params.type !== this.props.match.params.type) {
        const type = this.props.match.params.type;
        let c = `Список сотрудников на проф.мероприятия`;
        if (type === 'displist') {
            c = `Список сотрудников на проф.мероприятия`;
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
            alert("Укажите тему сообщения");
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
        
        
        let msg = {};
        msg.subject = this.state.msgSubject;
        msg.text    = this.state.msgText;
        msg.to      = this.state.msgTo;
        msg.period  = this.state.msgPeriod;
        msg.type    = this.props.match.params.type;

        // console.log(msg);
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
                                  startIcon={<PostAddIcon />}
                                  onClick={(e)=>this._handleSubmit(e)}>Создать список</Button>
                                {this.state.msgSending && <CircularProgress size={24} className={classes.buttonProgress} />}
                            </div>
                          </div>
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
                                <Grid item xs={12} sm={4}>
                                    <FormControl variant="standard" fullWidth className={classes.comboboxFormControl}>
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
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12}>
                                      <TextField
                                        fullWidth
                                        
                                        id="msg-text"
                                        label="Дополнительная информация (произвольный текст. Например: дата, адрес, время прохождения мероприятия)"
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
                            <div className={classes.buttonSendDiv} >
                              <div className={classes.wrapper}>
                                <Button 
                                  variant="contained"
                                  color="primary"
                                  type="submit" 
                                  disabled={this.state.msgSending}
                                  startIcon={<PostAddIcon />}
                                  onClick={(e)=>this._handleSubmit(e)}>Создать список</Button>
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


export default connect(mapStateToProps,mapDispatchToProps)(withRouter(withStyles(styles)(DispListNewMessage)));