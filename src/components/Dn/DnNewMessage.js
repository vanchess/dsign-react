import React, { useEffect, useMemo, useState } from 'react';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';

import CircularProgress from '@mui/material/CircularProgress';

import PostAddIcon from '@mui/icons-material/PostAdd';

import { userFetch } from '../../store/user/userAction.js'
import { cadesCertFetch, cadesCertSelectCancel, cadesCertSelectOk, cadesCertSelectStart, cadesSetSignFileIds, cadesSignFailure, cadesSignStart, cadesSignSuccess } from '../../store/cadesplugin/cadespluginAction.js'

import { fileService } from '../../services';
import { cadespluginService } from '../../services';
import { messageService } from '../../services';

import { Typography } from '@mui/material';
import { BackdropStyled } from '../Message/BackdropStyled.js';
import { ContainerStyled } from '../Message/ContainerStyled.js';
import { PaperStyled } from '../Message/PaperStyled.js';
import { SendButtonWrapper } from '../Message/SendButtonWrapper.js';
import { CircularProgressStyled } from '../Message/CircularProgressStyled.js';
import { useDispatch, useSelector } from 'react-redux';
import { useRouteMatch } from 'react-router-dom';
import FilesList from '../UploadFile/FilesList';
import CertDialog from '../Dialog/CertDialog.js';
import UploadFile from '../UploadFile/UploadFile.js';
import { fileDownload, textFileDownload } from '../../_helpers';
import { cadesSignFileIdsSelector, casesCertSelectionInProcessSelector, casesSignInProcessSelector } from '../../store/cadesplugin/cadespluginSelector.js';

export default function DnNewMessage(props) {
  const users = useSelector(store => store.userReducer.items);
  const usersLoading = useSelector(store => store.userReducer.loading);
  const loading = usersLoading;

  const dispatch = useDispatch();
  const fetchUsers = (page, perPage) => {dispatch(userFetch(page, perPage));};
  const fetchCert = () => {dispatch(cadesCertFetch());};

  const match = useRouteMatch();
  const type = match.params.type;

  const certDialogOpen = useSelector(casesCertSelectionInProcessSelector);
  const signFileIds = useSelector(cadesSignFileIdsSelector);
  const signInProcess = useSelector(casesSignInProcessSelector)

  const [fileSign, setFileSign] = useState({});  
  const [selectedMsgFilesIds, setSelectedMsgFilesIds] = useState([]);

  const [msgSubject, setMsgSubject] = useState('');
  const [msgText, setMsgText] = useState('');
  const [msgTo, setMsgTo] = useState([11]);
  const [msgSending, setMsgSending] = useState(false);

  const [msgFiles, setMsgFiles] = useState([]);

  const [title, msgSubjectLabel, msgTextLabel, SendButtonLabel, msgFilesField] = useMemo(() => {
    switch (type) {
      case 'dn-list':
        return [
          `Новый список на диспансерное наблюдение`,
          'Произвольное название списка', 
          'ОГРН организации', 
          'Создать список',
          null
        ];
      case 'dn-contract':
        return [
          `Новый договор на диспансерное наблюдение сотрудников`,
          'Организация (работодатель)', 
          'ОГРН организации', 
          'Отправить',
          {'required':true}
        ];
      default:
        return [
          `Новое сообщение`,
          '', 
          '', 
          'Отправить',
          null
        ];
    }
  }, [type]);

  useEffect(() => {
    fetchUsers(0, -1);
  }, []);

  useEffect(() => {
    props.setTitle(title);
    // setMsgSubject(c);
  }, [title]);

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

  const handleChangeMsgText = (e) => {
    e.preventDefault();
    setMsgText(e.target.value);
  }

  const handleChangeMsgSubject = (e) => {
    e.preventDefault();
    setMsgSubject(e.target.value);
  }

  const handleClickSign = (file) => {
    dispatch(cadesCertSelectStart());
    dispatch(cadesSetSignFileIds([file.id]));
    dispatch(cadesCertFetch());
  };

  const handleCloseCertDialog = (value) => {
    
    if(!value || !value.cert) {
      dispatch(cadesCertSelectCancel())
      return;
    }
    dispatch(cadesCertSelectOk(value))
    cadesSign(value.cert, signFileIds);
  };

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

  const handleOnUploadFile = (file) => {
    setMsgFiles((msgFiles) => {
      return [...msgFiles, file];
    })
  }

  const _handleSubmit = async () => {
    setMsgSending(true);  
    
    let err = [];
    if(!msgSubject) {
      err.push(`Пожалуйста, заполните поле "${msgSubjectLabel}"`);
    }
    if(!msgText) {
      err.push(`Пожалуйста, заполните поле "${msgTextLabel}"`);
    }
    if(msgFilesField?.required === true && !msgFiles.length) {
      err.push("Добавьте файлы");
    }
    
    if (err.length > 0) {
      alert(err[0]);
      setMsgSending(false);
      return;
    }
 
    const msg = {
      subject:msgSubject,
      text:msgText,
      to:msgTo,
      type:type,
      attach:msgFiles.map(item => item.id),
    };

    try {
      const data = await messageService.sendMsg(msg);
      props.history.push(`/dn/list/${type}/${data.id}`) 
    } 
    catch(err) {
      alert(err);
      
    }
    setMsgSending(false);
  }

  return (
    <div>
        <BackdropStyled open={signInProcess}>
          <CircularProgress color="inherit" />
        </BackdropStyled>
        <ContainerStyled maxWidth="lg" >
              <PaperStyled >
                <Grid container spacing={1}>
                    <Grid item xs={12}>
                    <SendButtonWrapper>
                          <Button 
                            variant="contained"
                            color="primary"
                            type="submit" 
                            disabled={msgSending}
                            startIcon={<PostAddIcon />}
                            onClick={(e)=>_handleSubmit(e)}>{SendButtonLabel}</Button>
                          {msgSending && <CircularProgressStyled size={24} />}
                    </SendButtonWrapper>
                    </Grid>
                    <Grid item xs={12}> 
                    <form onSubmit={(e)=>_handleSubmit(e)}>
                      <Grid container>
                          <Grid item xs={12}>
                          <TextField
                              variant="standard"
                              fullWidth
                              required
                              label={msgSubjectLabel}
                              id="msg-subject"
                              value={msgSubject}
                              onChange={handleChangeMsgSubject}
                              helperText=""
                              margin="normal" />
                          </Grid>
                          <Grid item xs={12}>
                              <TextField
                                  fullWidth
                                  required
                                  id="msg-text"
                                  label={msgTextLabel}
                                  multiline
                                  minRows = {2}
                                  maxRows={20}
                                  value={msgText}
                                  onChange={handleChangeMsgText}
                                  variant="outlined"
                                  margin="normal"
                                />
                          </Grid>
                          { msgFilesField ?
                          <Grid item xs={12}>
                                  <Typography variant="body1" align="left">
                                    Прикрепленные файлы
                                  </Typography>                          
                              
                                  <CertDialog open={certDialogOpen} onClose={handleCloseCertDialog} />
                                  <FilesList 
                                  
                                      items={msgFiles} 
                                      selectedIds = {selectedMsgFilesIds}
                                      selectAllClick = {handleSelectAllClick}
                                      selectItem = {handleSelectItem}
                                      fileSignArray = {fileSign}
                                      rowsPerPage={msgFiles.length}
                                      page={0} 
                                      loading={loading} 
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
                          : null }
                      </Grid>
                    </form>
                    </Grid>
                    { msgFilesField ? (
                    <Grid item xs={12}>
                      <UploadFile onUploadFile={(result) => handleOnUploadFile(result)} />
                    </Grid>
                    ) : null }
                    <Grid item xs={12}>
                      <SendButtonWrapper>
                          <Button 
                            variant="contained"
                            color="primary"
                            type="submit" 
                            disabled={msgSending}
                            startIcon={<PostAddIcon />}
                            onClick={(e)=>_handleSubmit(e)}>{SendButtonLabel}</Button>
                          {msgSending && <CircularProgressStyled size={24} />}
                      </SendButtonWrapper>
                    </Grid>
                </Grid>
              </PaperStyled>
        </ContainerStyled>
    </div>
  );
}