/* eslint-disable no-script-url */

import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Title from '../../dashboard/Title';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

import Chip from '@material-ui/core/Chip';

import Checkbox from '@material-ui/core/Checkbox';

import Skeleton from '@material-ui/lab/Skeleton';

import Link from '@material-ui/core/Link';
import IconButton from '@material-ui/core/IconButton';
import GetAppIcon from '@material-ui/icons/GetApp';
import HowToRegIcon from '@material-ui/icons/HowToReg';
import PictureInPictureAltIcon from '@material-ui/icons/PictureInPictureAlt';
import PictureAsPdfIcon from '@material-ui/icons/PictureAsPdf';

import moment from 'moment';

class FilesList extends React.Component {
  
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
                      <TableCell>
                        <Tooltip title={'Дата загрузки в систему: '+moment(row.attributes.created_at,"YYYY-MM-DDTHH:mm:ss.SSSSSSZ").local().format("DD.MM.YYYY HH:mm")}>
                            <Typography variant="body2" component="span">{row.attributes.name}</Typography>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <Tooltip title="Скачать файл">
                          <IconButton aria-label="download" onClick={ () => { this.props.getFile(row.attributes.link, row.attributes.name) } } ><GetAppIcon /></IconButton>
                        </Tooltip>
                        { this.props.fileSignArray[row.id] && (this.props.fileSignArray[row.id].length > 0) &&
                        <Tooltip title="Скачать копию файла в формате PDF">
                          <IconButton aria-label="download" onClick={ () => { this.props.getFile(row.attributes.linkPdf, row.attributes.name + '.pdf') } } ><PictureAsPdfIcon /></IconButton>
                        </Tooltip>
                        }
                        { (this.props.fileSignArray[row.id] && this.props.fileSignArray[row.id].length > 0) &&
                        <Tooltip title="Скачать копию файла с отметкой об электронной подписи">
                          <IconButton aria-label="download" onClick={ () => { this.props.getFile(row.attributes.linkStamped, row.attributes.name + '.pdf') } } ><PictureInPictureAltIcon /></IconButton>
                        </Tooltip>
                        }
                      </TableCell>
                      <TableCell>
                        <Tooltip title="Подписать файл электронной подписью">
                          <IconButton aria-label="sign" onClick={ () => { this.props.fileSign(row) } } ><HowToRegIcon /></IconButton>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        {this.props.fileSignArray[row.id] && (this.props.fileSignArray[row.id]).map((sign) => (
                            <div key={sign.id} >
                              <Tooltip title={ moment(sign.attributes.created_at,"YYYY-MM-DDTHH:mm:ss.SSSSSSZ").local().format("DD.MM.YYYY HH:mm") + (sign.attributes.verified_on_server_error_srt ? ' ! Ошибка при проверке подписи: ' + sign.attributes.verified_on_server_error_srt : '') }>
                                <Chip 
                                    style = {{cursor: 'pointer'}}
                                    label={ this.props.users[sign.attributes.user_id] ? this.props.users[sign.attributes.user_id].attributes.name : '<имя пользователя не загружено>' } 
                                    onClick={ () => { this.props.saveFileSignAsBase64(sign.attributes.base64, row.attributes.name) } }
                                    color={ sign.attributes.verified_on_server_error_srt ? 'secondary' : 'primary' } 
                                    variant="outlined"
                                />
                              </Tooltip>
                            </div>
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


export default FilesList;