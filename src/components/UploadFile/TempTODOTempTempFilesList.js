/* eslint-disable no-script-url */

import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Tooltip from '@material-ui/core/Tooltip';

import Title from '../../dashboard/Title';

import Checkbox from '@material-ui/core/Checkbox';

import Skeleton from '@material-ui/lab/Skeleton';

import Link from '@material-ui/core/Link';
import IconButton from '@material-ui/core/IconButton';
import GetAppIcon from '@material-ui/icons/GetApp';
import HowToRegIcon from '@material-ui/icons/HowToReg';

import { fileService } from '../../services';

import moment from 'moment';

class TempTODOTempTempFilesList extends React.Component {
      constructor(props){
          super(props);
          
          this.state = {
                fileSign: [],
          };
        }
        
        componentDidMount(){
            (this.props.items).map(item => {
                fileService.getFileSign(item.id).then((sign) =>
                    {
                        this.setState((state) => {
                            let newFileSignArr = state.fileSign;
                            newFileSignArr[item.id]=sign.data;
                            return {fileSign: newFileSignArr}
                          });
                    }
                );
            });
        }
        
        componentDidUpdate(prevProps, prevState) {
          if (prevProps.items.length == 0) {
                (this.props.items).map(item => {
                    fileService.getFileSign(item.id).then((sign) =>
                        {
                            this.setState((state) => {
                                let newFileSignArr = state.fileSign;
                                newFileSignArr[item.id]=sign.data;
                                return {fileSign: newFileSignArr}
                              });
                        }
                    );
                });
          }
        }
        
        handleAddFileSign(file_id) {
            return (sign) => this.addFileSign(file_id, sign);
        }
        
        addFileSign(file_id, sign) {
            this.setState((state) => {
                console.log(state.fileSign);
                let newFileSignArr = state.fileSign;
                if (state.fileSign[file_id]) {
                    newFileSignArr[file_id]=[...(state.fileSign[file_id]), sign];
                } else {
                    newFileSignArr[file_id]=[sign];
                }
                return {fileSign: newFileSignArr}
              });
        }
  

        isSelected = (id) => (this.props.selectedIds && this.props.selectedIds.indexOf(id) !== -1);
  
      
  
  render() {
      let i = 1 + this.props.rowsPerPage * this.props.page;

      let skeletonRowCount = this.props.rowsPerPage;
      if (skeletonRowCount < 0)
      {
        skeletonRowCount = 100;
      }
      let skeletonHeight = 36 + (33 * skeletonRowCount);

      let rowCount = this.props.items.length;
      
      let numSelected = 0;
      if(this.props.selectedIds) {
        numSelected = this.props.selectedIds.length;
      }
      
      return (
        <React.Fragment>
          
            { this.props.loading ?
             <Skeleton animation="wave" variant="rect" height={ skeletonHeight } />
             :
              <Table size="small">
                <TableHead>
                  <TableRow>
                  { this.props.selectedIds &&
                    (<TableCell padding="checkbox">
                      <Checkbox
                        indeterminate={numSelected > 0 && numSelected < rowCount}
                        checked={rowCount > 0 && numSelected === rowCount}
                        onChange={this.props.selectAllClick}
                        inputProps={{ 'aria-label': 'select all desserts' }}
                      />
                    </TableCell>)
                  }
                    <TableCell></TableCell>
                    <TableCell>Имя</TableCell>
                    <TableCell>Дата загрузки</TableCell>
                    <TableCell>Скачать</TableCell>
                    <TableCell>Подписать ЭП</TableCell>
                    <TableCell>ЭП</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                
                  {(this.props.items).map(row => (
                    <TableRow key={row.id} 
                      hover
                      role="checkbox"
                      aria-checked={this.isSelected(row.id)}
                      tabIndex={-1}
                      selected={this.isSelected(row.id)}
                    >
                    { this.props.selectedIds &&
                      (<TableCell padding="checkbox">
                        <Checkbox
                          checked={this.isSelected(row.id)}
                          onClick={(event) => this.props.selectItem(event, row.id)}
                        />
                      </TableCell>)
                    }
                      <TableCell>{i++}</TableCell>
                      <TableCell>{row.attributes.name}</TableCell>
                      <TableCell>{moment(row.attributes.created_at,"YYYY-MM-DDTHH:mm:ss.SSSSSSZ").local().format("DD.MM.YYYY HH:mm")}</TableCell>
                      <TableCell>
                        <Tooltip title="Скачать файл">
                          <IconButton aria-label="download" onClick={ () => { this.props.getFile(row.attributes.link, row.attributes.name) } } ><GetAppIcon /></IconButton>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <Tooltip title="Подписать файл электронной подписью">
                          <IconButton aria-label="sign" onClick={ () => { this.props.fileSign(row, this.handleAddFileSign(row.id) ) } } ><HowToRegIcon /></IconButton>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        {this.state.fileSign[row.id] && (this.state.fileSign[row.id]).map((sign) => (
                            <p key={sign.id}>
                                { this.props.users[sign.attributes.user_id].attributes.name } Дата: {moment(sign.attributes.created_at,"YYYY-MM-DDTHH:mm:ss.SSSSSSZ").local().format("DD.MM.YYYY HH:mm")}
                              <Tooltip title="Скачать файл электронной подписи в текстовом виде (BASE64)">
                                <IconButton aria-label="download" onClick={ () => { this.props.saveFileSignAsBase64(sign.attributes.base64, row.attributes.name) } } ><GetAppIcon /></IconButton>
                              </Tooltip>
                              <Tooltip title="Скачать файл электронной подписи в бинарном виде">
                                <IconButton aria-label="download" onClick={ () => { this.props.saveFileSignAsBin(sign.attributes.base64, row.attributes.name) } } ><GetAppIcon /></IconButton>
                              </Tooltip>
                            </p>
                        ))}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
          }
        </React.Fragment>
      );
  }
}

export default TempTODOTempTempFilesList;