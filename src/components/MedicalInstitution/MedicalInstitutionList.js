/* eslint-disable no-script-url */

import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Title from '../../dashboard/Title';

import Skeleton from '@mui/material/Skeleton';


class MedicalInstitutionList extends React.Component {
  
  render() {
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
                    <TableCell>Код</TableCell>
                    <TableCell>Наименование</TableCell>
                    <TableCell>Руководитель</TableCell>
                    <TableCell>Телефон</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(this.props.medicalInstitutions).map(row => (
                    <TableRow key={row.id}>
                      <TableCell>{i++}</TableCell>
                      <TableCell>{row.attributes.code}</TableCell>
                      <TableCell>{row.attributes.short_name}</TableCell>
                      <TableCell>{row.attributes.chief}</TableCell>
                      <TableCell>{row.attributes.phone}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
          }
        </React.Fragment>
      );
  }
}

export default MedicalInstitutionList;