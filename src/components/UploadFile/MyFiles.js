import React from 'react';
//import clsx from 'clsx';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import TablePagination from '@mui/material/TablePagination';
// import Button from '@mui/material/Button';

import UploadFile from './UploadFile';
import FilesList from './FilesList';

// import withStyles from '@mui/styles/withStyles';

import { connect } from 'react-redux';

import { myFileFetch } from '../../store/my-file/myFileAction.js'
import { myFileStartChangeRowPerPage, myFileStartChangePage } from '../../store/pagination/my-file/myFilePaginationAction.js'
import { cadesCertFetch } from '../../store/cadesplugin/cadespluginAction.js'

import { fileService } from '../../services';
import { cadespluginService } from '../../services';

import CertDialog from '../Dialog/CertDialog';

import { fileDownload, textFileDownload } from '../../_helpers';

const styles = theme => ({
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
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
})

class MyFiles extends React.Component {
    
    constructor(props){
      super(props);
      
      this.props.setTitle('Загрузка файла');
      
      this.state = {
        certDialogOpen: false,
        certDialogSelectedValue: {},
        signFileId: null,
        signFileUrl: '',
        signFileName: ''
      };
      
      this.handleClickSign = this.handleClickSign.bind(this);
      this.handleClose = this.handleClose.bind(this);
    }
    
    componentDidMount(){
        this.props.fetchMyFiles(this.props.page, this.props.perPage);

        cadesplugin.then(function () {
               console.log('КриптоПро. Плагин успешно загружен');
           },
           function(error) {
               console.log(`КриптоПро. При загрузке плагина произошла ошибка: ${error}`);
           }
        );
    }
    

    handleClickSign = (file) => {
        this.setState({
            certDialogOpen: true,
            certDialogSelectedValue: {},
            signFileId: file.id,
            signFileUrl: file.attributes.link,
            signFileName: file.attributes.name
        });
        
        this.props.fetchCert();
    };

    handleClose = (value) => {
        this.setState({
            certDialogOpen: false,
            certDialogSelectedValue: value
        });
        
        if(!value.cert) return;
        
        let {signFileId, signFileUrl, signFileName} = this.state;

        fileService.getFile(signFileUrl).then(
            (fileBlob) => {
                cadespluginService.FileSignCreate(value.cert, fileBlob).then(
                    function (result){

                        // Сохраняем подпись на сервере
                        fileService.saveFileSign(signFileId, {
                                'base64':result
                            })
                        // Скачиваем текстовый файл(base64)
                        textFileDownload(result,signFileName+'.sig');
                        fetch('data:application/octet-stream;base64,'+result).then((response) => {
                                response.blob().then(blob => {
                                        // Скачиваем бинарный файл
                                        fileDownload(blob,signFileName+'.sgn')
                                })
                            })
                    },
                    function (error){
                        console.log(`Error: ${error}`);
                    });
            }
        )
    };

  
  render() {
      const { classes } = this.props;
      //const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

      return (
          <main className={classes.content}>
            <div className={classes.appBarSpacer} />
            <Container maxWidth="lg" className={classes.container}>
              <Grid container spacing={3}>
                {/* Recent Orders */}
                <Grid item xs={12}>
                  <Paper className={classes.paper}>

                    <CertDialog selectedValue={this.state.certDialogSelectedValue} open={this.state.certDialogOpen} onClose={this.handleClose} />
                    
                    <FilesList 
                        items={this.props.items} 
                        rowsPerPage={this.props.perPage} 
                        page={this.props.page} 
                        loading={this.props.loading} 
                        getFile={ (url, filename) => { 
                            fileService.getFile(url).then(
                                fileBlob => fileDownload(fileBlob, filename)
                            )}
                        }
                        fileSign={this.handleClickSign}
                        
                     />
                    { this.props.itemsTotal ?
                    <TablePagination
                       rowsPerPageOptions={[10, 15, 20, 50, 100, {value: -1, label: 'All'}]}
                       component="div"
                       count= {this.props.itemsTotal}
                       rowsPerPage={this.props.perPage}
                       page={this.props.page}
                       backIconButtonProps={{
                         'aria-label': 'Previous Page',
                       }}
                       nextIconButtonProps={{
                         'aria-label': 'Next Page',
                       }}
                       
                       onPageChange={this.props.handleChangePage}
                       onRowsPerPageChange={this.props.handleChangeRowsPerPage}
                    /> : null }
                    
                    <UploadFile 
                        onUploadFile={() => { this.props.fetchMyFiles(this.props.page, this.props.perPage) } } 
                    />
                    
                  </Paper>
                </Grid>
              </Grid>
            </Container>
          </main>
      );
  }
}


const mapStateToProps = function(store) {
  // console.log(store);
  return {
      items: store.myFileReducer.items, 
      page: store.paginationReducer.myFile.page, 
      perPage: store.paginationReducer.myFile.perPage,
      itemsTotal: store.paginationReducer.myFile.itemsTotal,
      loading: store.myFileReducer.loading,
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
    fetchMyFiles: (page, perPage) => {
        dispatch(myFileFetch(page, perPage));
    },
    fetchCert: () => {
        dispatch(cadesCertFetch());
    }
  }
}


export default connect(mapStateToProps,mapDispatchToProps)(withStyles(styles)(MyFiles));