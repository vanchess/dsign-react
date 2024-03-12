/* eslint-disable no-script-url */

import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import Chip from '@mui/material/Chip';

import Checkbox from '@mui/material/Checkbox';

import Skeleton from '@mui/material/Skeleton';

import IconButton from '@mui/material/IconButton';
import GetAppIcon from '@mui/icons-material/GetApp';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import PictureInPictureAltIcon from '@mui/icons-material/PictureInPictureAlt';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

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
             <Skeleton animation="wave" variant="rectangular" height={ skeletonHeight } />
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
                        <Tooltip title={'Дата загрузки в систему: '+moment(row.attributes.created_at,"YYYY-MM-DDTHH:mm:ss.SSSSSSZ").local().format("DD.MM.YYYY HH:mm")} disableInteractive>
                            <Typography variant="body2" component="span">{row.attributes.name}</Typography>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <Tooltip title="Скачать файл" disableInteractive>
                          <IconButton
                            aria-label="download"
                            onClick={ () => { this.props.getFile(row.attributes.link, row.attributes.name) } }
                            size="large"><GetAppIcon /></IconButton>
                        </Tooltip>
                        { this.props.fileSignArray[row.id] && (this.props.fileSignArray[row.id].length > 0) &&
                        <Tooltip title="Скачать копию файла в формате PDF" disableInteractive>
                          <IconButton
                            aria-label="download"
                            onClick={ () => { this.props.getFile(row.attributes.linkPdf, row.attributes.name + '.pdf') } }
                            size="large"><PictureAsPdfIcon /></IconButton>
                        </Tooltip>
                        }
                        { (this.props.fileSignArray[row.id] && this.props.fileSignArray[row.id].length > 0) &&
                        <Tooltip title="Скачать копию файла с отметкой об электронной подписи" disableInteractive>
                          <IconButton
                            aria-label="download"
                            onClick={ () => { this.props.getFile(row.attributes.linkStamped, row.attributes.name + '.pdf') } }
                            size="large"><PictureInPictureAltIcon /></IconButton>
                        </Tooltip>
                        }
                      </TableCell>
                      <TableCell>
                        <Tooltip title="Подписать файл электронной подписью" disableInteractive>
                          <IconButton
                            aria-label="sign"
                            onClick={ () => { this.props.fileSign(row) } }
                            size="large"><HowToRegIcon /></IconButton>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        {this.props.fileSignArray[row.id] && (this.props.fileSignArray[row.id]).map((sign) => (
                            <div key={sign.id} >
                              <Tooltip title={ moment(sign.attributes.created_at,"YYYY-MM-DDTHH:mm:ss.SSSSSSZ").local().format("DD.MM.YYYY HH:mm") + (sign.attributes.verified_on_server_error_srt ? ' ! Ошибка при проверке подписи: ' + sign.attributes.verified_on_server_error_srt : '') } disableInteractive>
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