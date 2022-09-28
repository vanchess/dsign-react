/* eslint-disable no-script-url */

import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import Chip from '@material-ui/core/Chip';

import Skeleton from '@material-ui/lab/Skeleton';

import StatusIcon from './StatusIcon';

import { withStyles } from '@material-ui/core/styles';

import moment from 'moment';

const styles = theme => ({
     tableRow: {
       "&:hover": {
           cursor: 'pointer'
        }
      },
});
/*
const styles = theme => ({
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  }
})
*/


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
             <Skeleton animation="wave" variant="rect" height={ skeletonHeight } />
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
                    <TableRow key={row.id} onClick={ () => { this.props.showItem(row.id) } } hover={true} className={ classes.tableRow }>
                      <TableCell>{i++}</TableCell>
                      {(this.props.displayColumnTo)?(
                      <TableCell>
                            { (row.relationships.to_users.data).map( (toUser) => 
                                (<Chip key={toUser.id} label={toUser.attributes.name} className={ classes.tableRow }/>)
                            )}
                      </TableCell>
                      ):null}
                      {(this.props.displayColumnFrom)?(
                      <TableCell><Chip label={row.relationships.user.data.attributes.name} className={ classes.tableRow }/></TableCell>
                      ):null}
                      {(this.props.displayCategory)?(
                      <TableCell>
                            { (row.relationships.category.data).map( (c) => 
                                (<Chip key={c.id} label={c.attributes.short_title} className={ classes.tableRow }/>)
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

export default withStyles(styles)(MessageList);