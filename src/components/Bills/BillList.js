import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';

import CustomToolbar from '../DataGrid/CustomToolbar';
import CustomNoRowsOverlay from '../DataGrid/CustomNoRowsOverlay';
import CustomLoadingOverlay from '../DataGrid/CustomLoadingOverlay';
import CustomPagination from '../DataGrid/CustomPagination';
import { useSelector } from 'react-redux';

export default function BillList(props) {
  const periodList = useSelector(store => store.periodReducer.items);
console.log(periodList);
  return (
    <div style={{ minHeight: '400px', height: 'calc(100vh - 128px)', width: '100%' }}>
      
      <DataGrid 
        pagination 
        density="compact"
        loading = {props.loading}
        rowsPerPageOptions={[5, 10, 20]}
        rows={
            props.items.map((msg) => {
                return ({
                    'id': msg.id, 
                    'subject': msg.attributes.subject,
                    'from': msg.relationships.user.data.attributes.name,
                    'createdAt': msg.attributes.created_at,
                    'status': msg.relationships.status.data.attributes,
                    'category': msg.relationships.category.data.reduce((res,c) => {
                        res[c.id] = {name: c.attributes.name, short_title: c.attributes.short_title};
                        return res;
                      }, []),
                    'period': periodList.find(item => {
                      //console.log(item?.id);
                      //console.log(msg.attributes.period_id);
                      
                      return Number(item?.id) === msg.attributes.period_id;
                    })?.attributes.name,
                });
            })
        } 
        columns={props.columns} 
        /*
        filterModel={{
          items: [
                { columnField: 'status', value: [], operatorValue: 'in' },
                { columnField: 'status', value: [], operatorValue: 'notin' }
          ],
        }}
        */
        autoPageSize 
        /*pageSize={20}*/ 
        components={{
          Toolbar: CustomToolbar,
          LoadingOverlay: CustomLoadingOverlay,
          NoRowsOverlay: CustomNoRowsOverlay,
          Pagination: CustomPagination,
        }}
        /*checkboxSelection */
      />
    </div>
  );
}