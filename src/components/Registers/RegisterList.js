import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';

import CustomToolbar from '../DataGrid/CustomToolbar';
import CustomNoRowsOverlay from '../DataGrid/CustomNoRowsOverlay';
import CustomLoadingOverlay from '../DataGrid/CustomLoadingOverlay';
import CustomPagination from '../DataGrid/CustomPagination';
import { useSelector } from 'react-redux';

export default function BillList(props) {
  const periodList = useSelector(store => store.periodReducer.items);
  return (
    <div style={{ minHeight: '400px', height: 'calc(100vh - 128px)',width: '100%' }}>
      
      <DataGrid 
        pagination 
        initialState={{ 
          density: "compact",
          columns: {
            columnVisibilityModel: {
                id: false,
            },
          },
        }}
        loading = {props.loading}
        pageSizeOptions={[5, 10, 20]}
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
                        return Number(item?.id) === msg.attributes.period_id;
                    })?.attributes.name,

                });
            })
        } 
        columns={props.columns} 

        autoPageSize 

        slots={{
          toolbar: CustomToolbar,
          loadingOverlay: CustomLoadingOverlay,
          noRowsOverlay: CustomNoRowsOverlay,
          pagination: CustomPagination,
        }}

      />
    </div>
  );
}