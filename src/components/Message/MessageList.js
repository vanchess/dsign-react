import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import Chip from '@mui/material/Chip';

import Skeleton from '@mui/material/Skeleton';

import StatusIcon from './StatusIcon';

import moment from 'moment';

class MessageList extends React.Component {

  render() {
      const { classes } = this.props;
      
      let i = 1 + this.props.rowsPerPage * this.props.page;

      let skeletonRowCount = this.props.rowsPerPage;
      if (skeletonRowCount < 0)
      {
        skeletonRowCount = 100;
      }
      let skeletonHeight = 36 + (33 * skeletonRowCount);

      return (
        <React.Fragment>
          
            { this.props.loading ?
             <Skeleton animation="wave" variant="rectangular" height={ skeletonHeight } />
             :
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell></TableCell>
                    {(this.props.displayColumnTo)?(
                    <TableCell>Кому</TableCell>
                    ):null}
                    {(this.props.displayColumnFrom)?(
                    <TableCell>От кого</TableCell>
                    ):null}
                    {(this.props.displayCategory)?(
                    <TableCell>Категория</TableCell>
                    ):null}
                    <TableCell>Тема</TableCell>
                    <TableCell>Дата</TableCell>
                    {(this.props.displayStatus)?(
                    <TableCell>Статус</TableCell>
                    ):null}
                  </TableRow>
                </TableHead>
                <TableBody>
                
                  {(this.props.items).map(row => (
                    <TableRow key={row.id} onClick={ () => { this.props.showItem(row.id) } } hover={true} sx={{"&:hover": {cursor: 'pointer'}}}>
                      <TableCell>{i++}</TableCell>
                      {(this.props.displayColumnTo)?(
                      <TableCell>
                            { (row.relationships.to_users.data).map( (toUser) => 
                                (<Chip key={toUser.id} label={toUser.attributes.name} sx={{"&:hover": {cursor: 'pointer'}}} />)
                            )}
                      </TableCell>
                      ):null}
                      {(this.props.displayColumnFrom)?(
                      <TableCell><Chip label={row.relationships.user.data.attributes.name} sx={{"&:hover": {cursor: 'pointer'}}} /></TableCell>
                      ):null}
                      {(this.props.displayCategory)?(
                      <TableCell>
                            { (row.relationships.category.data).map( (c) => 
                                (<Chip key={c.id} label={c.attributes.short_title} sx={{"&:hover": {cursor: 'pointer'}}} />)
                            )}
                      </TableCell>
                      ):null}
                      <TableCell>{row.attributes.subject}</TableCell>
                      <TableCell>
                          {moment(row.attributes.created_at,"YYYY-MM-DDTHH:mm:ss.SSSSSSZ").local().format("DD.MM.YYYY HH:mm")}
                      </TableCell>
                      {(this.props.displayStatus)?(
                      <TableCell>
                           <StatusIcon label={row.relationships.status.data.attributes.lable} name={row.relationships.status.data.attributes.name} />
                      </TableCell>
                      ):null}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
          }
        </React.Fragment>
      );
  }
}

export default MessageList;