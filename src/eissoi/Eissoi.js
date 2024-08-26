import React, { useState } from "react";
import {
    Button,
    Chip,
    CssBaseline,
    IconButton,
    styled,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Tooltip,
    Typography,
} from "@mui/material";
import CertDialogAllSnils from "../components/Dialog/CertDialogAllSnils";
import HowToRegIcon from '@mui/icons-material/HowToReg';
import ArchiveIcon from '@mui/icons-material/Archive';
import { useDispatch } from "react-redux";
import { cadesCertFetch } from "../store/cadesplugin/cadespluginAction";
import { authService, cadespluginService } from "../services";
import { fileDownload, textFileDownload } from "../_helpers";
import JSZip from "jszip";
import { Header } from "../eissoi/Header";
import { CircularProgressStyled } from "../components/Message/CircularProgressStyled";

const Wrapper = styled('div')(({theme}) => ({
  margin: theme.spacing(1),
  position: 'relative',
}))

const AppBarSpacer = styled('div')(({theme}) => theme.mixins.toolbar);

const MainContent  = styled('main')`
  flex-grow: 1;
  height: '100vh';
  overflow: 'auto';
`


export default function Eissoi() {
    const dispatch = useDispatch();

    let [files, setFiles] = useState([]);
    let [certDialogOpen, setCertDialogOpen] = useState(false);
    let [fileSignArray, setFileSignArray] = useState({});
    let [loading, setLoading] = useState(false);
    let certDialogSelectedValue = {};
    let [signFile, setSignFile] = useState(null);
    let [signInProcess, setSignInProcess] = useState(false)

    let i = 1;

    const getZipOms = (file) => {
        setLoading(true);
        var zip = new JSZip();
        zip.file(file.name, file.file, {base64: true});
        if (fileSignArray[file.id]) {
           (fileSignArray[file.id]).forEach((sign) => {
              zip.file(file.name + '.sig', sign.base64, {base64: true});
           })
        }
        zip.generateAsync({type:"blob", compression: "DEFLATE"})
        .then(function(content) {
            fileDownload(content, file.name.replace(".xml", "") + ".oms");
            setLoading(false);
        }).catch(function(err) {
          alert(err);
          setLoading(false);
        });
    }

    const _handleChange = (e) => {
        e.preventDefault();
    
        let len = e.target.files.length;
        if (len < 1) {
            return;
        }
        
        let attachment = [];
        for (let i = 0; i < len; i++) {
            const fileName = e.target.files[i].name;
            attachment.push( {name: fileName, file: e.target.files[i], id: new Date().getTime() + fileName} );
        }
    
        setFiles(attachment);
    };

    const handleCloseCertDialog = (value) => {
        certDialogSelectedValue = value
        
        setCertDialogOpen(false);
        
        if(!certDialogSelectedValue || !certDialogSelectedValue.cert) return;
        
        fileSignCreate();
    };

    const handleClickSign = (file) => {
        certDialogSelectedValue = {};
        setSignFile(file);
        
        setCertDialogOpen(true);
        
        dispatch(cadesCertFetch());
    };

    const addFileSign = (fileId, sign) => {
      setFileSignArray((fileSign) => {
          let newFileSignArr = {...fileSign};
          if (fileSign[fileId]) {
              newFileSignArr[fileId]=[...(fileSign[fileId]), sign];
          } else {
              newFileSignArr[fileId]=[sign];
          }
          return newFileSignArr;
        });
    }

    const fileSignCreate = () => {
      setSignInProcess(true);  

      cadespluginService.FileSignCreateReadingFileInChunks(certDialogSelectedValue.cert, signFile.file).then(
            (result) => {
                addFileSign(signFile.id, {name: certDialogSelectedValue.name, base64:result, id: new Date().getTime() + certDialogSelectedValue.thumbprint});
                setSignInProcess(false);
            },
            (error) => {
              setSignInProcess(false);
                console.log(`Error: ${error}`);
                alert(`Error: ${error}`);
            });
        
    };

    const saveFileSignAsBase64 =  (result, signFileName) => {
          // Скачиваем текстовый файл(base64)
          textFileDownload(result,signFileName+'.sig');
    }

    return (
        <div>
            <CssBaseline />
            <Header title={'Подписание файлов (для ЕИССОИ)'} open={false} userName={''} handleDrawerOpen={() => {}} logout={authService.logout}  />
            <CertDialogAllSnils open={certDialogOpen} onClose={handleCloseCertDialog} />
            <MainContent>
              <AppBarSpacer />
              <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell></TableCell>
                      <TableCell>Имя</TableCell>
                      <TableCell>Скачать</TableCell>
                      <TableCell>Подписать ЭП</TableCell>
                      <TableCell>ЭП</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                  
                    {(files).map(row => (
                      <TableRow key={row.id} 
                        hover
                        role="checkbox"
                        tabIndex={-1}
                      >
                        <TableCell>{i++}</TableCell>
                        <TableCell>
                              <Typography variant="body2" component="span">{row.name}</Typography>
                        </TableCell>
                        <TableCell>
                        {fileSignArray[row.id] && (
                          <Tooltip title="Скачать архив с подписью" disableInteractive>
                            <Wrapper>
                              <IconButton
                                  aria-label="zip"
                                  onClick={ () => { getZipOms(row) } }
                                  disabled={ loading }
                                  size="large"><ArchiveIcon /></IconButton>
                              {loading && <CircularProgressStyled size={24}/>}
                            </Wrapper>
                          </Tooltip>
                        )}
                        </TableCell>
                        <TableCell>
                          <Tooltip title="Подписать файл электронной подписью" disableInteractive>

                            <Wrapper>
                              <IconButton
                                  aria-label="sign"
                                  disabled={( signInProcess || certDialogOpen)}
                                  onClick={ () => { handleClickSign(row) } }
                                  size="large"><HowToRegIcon /></IconButton>
                              {signInProcess && <CircularProgressStyled size={24} />}
                            </Wrapper>
                          </Tooltip>
                        </TableCell>
                        <TableCell>
                          {fileSignArray[row.id] && (fileSignArray[row.id]).map((sign) => (
                              <div key={sign.id} >
                                  <Chip 
                                      style = {{cursor: 'pointer'}}
                                      label={ sign.name ? sign.name : '<имя пользователя не загружено>' } 
                                      onClick={ () => { saveFileSignAsBase64(sign.base64, row.name) } }
                                      color={ 'primary' } 
                                      variant="outlined"
                                  />
                              </div>
                          ))}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
              </Table>
          
              <div>
                  <form>
                      <div style={{display: 'flex', alignItems: 'center'}}>
                          <Wrapper>
                              <Button variant="contained" component="label">
                                  Выбрать файлы
                                  <input
                                      type="file"
                                      multiple
                                      onChange={(e)=>_handleChange(e)}
                                      hidden
                                  />
                              </Button>
                          </Wrapper>
                      </div>
                  </form>
              </div>
            </MainContent>
        </div>
    );
}