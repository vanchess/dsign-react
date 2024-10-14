import React, { useEffect, useState } from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';

import MailLockIcon from '@mui/icons-material/MailLock';

import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams, useRouteMatch } from "react-router-dom";

import HowToRegIcon from '@mui/icons-material/HowToReg';
import PictureInPictureAltIcon from '@mui/icons-material/PictureInPictureAlt';

import { fileService, messageService, cadespluginService } from '../../services';
import styled from '@emotion/styled';
import { userFetch } from '../../store/user/userAction';
import { cadesCertFetch, cadesCertSelectCancel, cadesCertSelectOk, cadesCertSelectStart, cadesSetSignFileIds, cadesSignFailure, cadesSignStart, cadesSignSuccess } from '../../store/cadesplugin/cadespluginAction';
import { Backdrop, Chip, CircularProgress, Popover, TextField, Typography } from '@mui/material';
import StatusIcon from '../Message/StatusIcon';

import FilesList from '../UploadFile/FilesList';
import CertDialog from '../Dialog/CertDialog';

import { fileDownload, textFileDownload } from '../../_helpers';
import { cadesSignFileIdsSelector, casesCertSelectionInProcessSelector, casesSelectedCertSelector, casesSignInProcessSelector } from '../../store/cadesplugin/cadespluginSelector';
import { ActionButtonWrapper } from '../Message/ActionButtonWrapper';
import { CircularProgressStyled } from '../Message/CircularProgressStyled';
import DnDataGrid from './DnDataGrid';

const ContainerStyled = styled(Container)(
  ({theme}) => ({
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(0),
  })
);

const PaperStyled = styled(Paper)(
  ({theme}) => ({
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
  })
);

const BackdropStyled = styled(Backdrop)(
  ({theme}) => ({
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  })
)

export default function DnShowMessage(props) {
  const dispatch = useDispatch();
  const permission = useSelector((store) => store.authReducer.user.permissions);
  const users = useSelector((store) => store.userReducer.items);
  const history = useHistory();
  const {type} = useParams();

  const match = useRouteMatch();
  const msgId = match.params.id;
  const [dnlistId, setDnlistId] = useState(null);

  
  const [msgSubject, setMsgSubject] = useState('');
  const [msgText, setMsgText] = useState('');
  const [msgFromId, setMsgFromId] = useState(null);
  const [msgTo, setMsgTo] = useState([]);
  const [periodId, setPeriodId] = useState(null);

  const [msgFiles, setMsgFiles] = useState([]);
  const [msgFilesLoading, setMsgFilesLoading] = useState(true);
  const [fileSign, setFileSign] = useState({});  

  const [msgStatusLabel, setMsgStatusLabel] = useState('');
  const [msgStatusName, setMsgStatusName] = useState('');
  
  const certDialogOpen = useSelector(casesCertSelectionInProcessSelector);
  const signInProcess = useSelector(casesSignInProcessSelector)
      
  const [selectedMsgFilesIds, setSelectedMsgFilesIds] = useState([]);

  const selectedCert = useSelector(casesSelectedCertSelector);
  const signFileIds = useSelector(cadesSignFileIdsSelector);

  const periodList = useSelector(store => store.periodReducer.items);

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;
  useEffect(() => {
    props.setTitle('Cообщение');

    dispatch(userFetch(0, -1));

  }, [])

  useEffect(() => {
      if (msgId) {
        messageService.getDnLists(msgId).then(
          (data) => {
            setDnlistId(data.data[0]?.id);
          }
        )

        messageService.get(msgId).then(
          (msg) => {
            messageService.getTo(msgId).then(
                (toUsers) => setMsgTo(toUsers.data.map((item) => item.attributes.name))
            );
                    
            messageService.getFiles(msgId).then(
                (files) => {
                  setMsgFiles(files.data);
                  setMsgFilesLoading(false);
                    
                  // Получаем ЭП файлов
                  files.data.map(item => {
                        fileService.getFileSign(item.id).then((sign) =>
                            {
                              setFileSign((fileSign) => {
                                    let newFileSignArr = { ...fileSign };
                                    newFileSignArr[item.id]=sign.data;
                                    return newFileSignArr
                                  });
                            }
                        );
                  });
                },
                (error) => {
                  setMsgFiles([]);
                  setMsgFilesLoading(false);
                },
            );
            
            setMsgSubject(msg.attributes.subject);
            setMsgText(msg.attributes.text);
            setMsgFromId(msg.attributes.user_id);
            setMsgStatusLabel(msg.relationships.status.data.attributes.lable);
            setMsgStatusName(msg.relationships.status.data.attributes.name);
            setPeriodId(msg.attributes.period_id);
            
          }
        );
      }
  }, [msgId])

  const periodName  = periodList.find(item => {
        return Number(item?.id) === periodId;
      })?.attributes.name ?? ''

  const msgFrom = users[msgFromId] ? users[msgFromId].attributes.name : '';

  const handleSetStatusSent = () => {
    messageService.setStatus(msgId, 'sent').then(
        () => { 
            history.push('/dn/list/dn-list') 
        },
        (err) => { 
            alert(err);
        } 
    );
  }


  const handleClickGetFileMultiple = async () => {
      let len = selectedMsgFilesIds.length;

      for(let i = 0; i < len; i++) {
        try {
          let fileId = selectedMsgFilesIds[i];
          let file = await fileService.getFileStampedByIdWithFilename(fileId);
          fileDownload(file.blob, file.filename);
        } catch(err) {
          console.log(`Error: ${err}`);
        }
      }
  };

  const handleClickSignMultiple = () => {
    dispatch(cadesCertSelectStart());
    dispatch(cadesSetSignFileIds([...selectedMsgFilesIds]));
    dispatch(cadesCertFetch());
  };
  
  const handleClickSign = (file) => {
    dispatch(cadesCertSelectStart());
    dispatch(cadesSetSignFileIds([file.id]));
    //setSignFileName(file.attributes.name);
    
    dispatch(cadesCertFetch());
  };

  const cadesSign = async (cert, fileIds) => {
    dispatch(cadesSignStart());
    
    try {
      let len = fileIds.length;
      for(let i = 0; i < len; i++) {
        
          let fileId = fileIds[i];
          let fileBlob = await fileService.getFileById(fileId);
          let signBase64String = await cadespluginService.FileSignCreate(cert, fileBlob);
          // Сохраняем подпись на сервере
          let sign = await fileService.saveFileSign(fileId, {'base64':signBase64String});
          
          addFileSign(fileId, sign);
        
      }
    } catch(err) {
      console.log(`Error: ${err}`);
      dispatch(cadesSignFailure());
    }
    dispatch(cadesSignSuccess());
  }

  const addFileSign = (fileId, sign) => {
    setFileSign((fileSign) => {
      let newFileSignArr = { ...fileSign };
      if (fileSign[fileId]) {
          newFileSignArr[fileId]=[...(fileSign[fileId]), sign];
      } else {
          newFileSignArr[fileId]=[sign];
      }
      return newFileSignArr;
    });
  }

  const handleCloseCertDialog = (value) => {
    
    if(!value || !value.cert) {
      dispatch(cadesCertSelectCancel())
      return;
    }
    dispatch(cadesCertSelectOk(value))
    cadesSign(value.cert, signFileIds);
  };

  const handleSelectItem = (event, id) => {
    setSelectedMsgFilesIds((selectedMsgFilesIds) => {
      const selectedIndex = selectedMsgFilesIds.indexOf(id);
      let newSelected = [];

      if (selectedIndex === -1) {
        newSelected = newSelected.concat(selectedMsgFilesIds, id);
      } else if (selectedIndex === 0) {
        newSelected = newSelected.concat(selectedMsgFilesIds.slice(1));
      } else if (selectedIndex === selectedMsgFilesIds.length - 1) {
        newSelected = newSelected.concat(selectedMsgFilesIds.slice(0, -1));
      } else if (selectedIndex > 0) {
        newSelected = newSelected.concat(
          selectedMsgFilesIds.slice(0, selectedIndex),
          selectedMsgFilesIds.slice(selectedIndex + 1),
        );
      }

      return newSelected;
    })  
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
        const newSelecteds = msgFiles.map((n) => n.id);
        setSelectedMsgFilesIds(newSelecteds);
        return;
      }
      setSelectedMsgFilesIds([]);
  };

  return (
      <div>
        <BackdropStyled open={signInProcess}>
          <CircularProgress color="inherit" />
        </BackdropStyled>
        <ContainerStyled maxWidth="lg">
              <PaperStyled>
                  <Grid container spacing={1}>
                      <Grid item xs={6}>
                          <TextField
                              variant="standard"
                              fullWidth
                              readOnly
                              label="Организация (место работы или учебы лиц)"
                              id="msg-subject"
                              value={msgSubject}
                              helperText="" />
                      </Grid>
                      <Grid item xs={1}>
                          <TextField
                              variant="standard"
                              fullWidth
                              readOnly
                              label="Период"
                              id="msg-period"
                              value={periodName}
                              helperText="" />
                      </Grid>
                      <Grid item xs={2}>
                        <Button aria-describedby={id} variant="contained" onClick={handleClick}>
                          Подробнее
                        </Button>
                      </Grid>
                      {(msgStatusName === 'draft' && permission && permission.includes('send ' + type)) ?
                      (<Grid item xs={3}>
                        <Button 
                            variant="contained"
                            color="secondary"
                            startIcon={<MailLockIcon />}
                            onClick={handleSetStatusSent}>Завершить редактирование списка</Button>
                      </Grid>):
                      (<Grid item xs={3}>
                        <Typography variant="body2" align="left" color='textSecondary'>
                            Статус
                        </Typography>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            flexWrap: 'nowrap',
                        }}>
                            <StatusIcon name={msgStatusName} label={msgStatusLabel} />
                            {msgStatusLabel}
                        </div>
                      </Grid>)
                      }
                      
                      {(msgStatusName !== 'draft')?(
                      <>
                        <Grid item xs={12}>
                          <Typography variant="body2" align="left" color='textSecondary'>
                            Прикрепленные файлы
                          </Typography>       
                        </Grid>
                        <Grid item xs={12}>
                          <ActionButtonWrapper>
                                <Button 
                                  variant="contained"
                                  color="primary"
                                  disabled={(!selectedMsgFilesIds.length || signInProcess || certDialogOpen)}
                                  startIcon={<HowToRegIcon />}
                                  onClick={ handleClickSignMultiple }>Подписать ЭП</Button>
                                <Button 
                                  variant="contained"
                                  color="primary"
                                  disabled={(!selectedMsgFilesIds.length || signInProcess || certDialogOpen)}
                                  startIcon={<PictureInPictureAltIcon />}
                                  onClick={ handleClickGetFileMultiple }>Скачать с отметкой об ЭП</Button>
                                {(signInProcess || certDialogOpen) && <CircularProgressStyled size={24} />}
                          </ActionButtonWrapper>
                        </Grid>
                        <Grid item xs={12}>
                      
                          <FilesList 
                              items={msgFiles} 
                              selectedIds = {selectedMsgFilesIds}
                              selectAllClick = {handleSelectAllClick}
                              selectItem = {handleSelectItem}
                              fileSignArray = {fileSign}
                              rowsPerPage={msgFiles.length}
                              page={0} 
                              loading={msgFilesLoading} 
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
                              fileSign={handleClickSign}
                              
                              users={users}
                            />
                        </Grid>
                      </>):null}
                  </Grid>
              </PaperStyled>
        </ContainerStyled>
        <CertDialog open={certDialogOpen} onClose={handleCloseCertDialog} />
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
        >
          <ContainerStyled>
            <Grid item xs={12}>
                <TextField
                    variant="standard"
                    fullWidth
                    readOnly
                    label="Организация (место работы или учебы лиц)"
                    value={msgSubject}
                    helperText="" />
            </Grid>
            <Grid item xs={12}>
                  <TextField
                    fullWidth
                    readOnly
                    id="msg-text"
                    label="Место проведения мероприятия"
                    multiline
                    minRows={2}
                    maxRows={20}
                    value={msgText}
                    variant="outlined"
                    margin="normal"
                  />
            </Grid>
            <Grid container>
              <Grid item xs={12}>
                  <div align="left">
                    <Typography variant="body2" align="left" color='textSecondary'>
                      От кого
                    </Typography> 
                    <Chip label={msgFrom}/>
                  </div>
              </Grid>
              <Grid item xs={12}>
                  <div align="left">
                    <Typography variant="body2" align="left" color='textSecondary'>
                      Кому
                    </Typography> 
                    { (msgTo).map( (toUser) => 
                        (<Chip key={toUser} label={toUser}/>)
                    )}
                  </div>
              </Grid>
            </Grid>
          </ContainerStyled>  
        </Popover>
        
      {dnlistId &&
        <DnDataGrid listId = {dnlistId} isDraft = {msgStatusName === 'draft'} />
      }
    </div>
  )
}