import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';

import makeStyles from '@mui/styles/makeStyles';

import CustomToolbar from '../DataGrid/CustomToolbar';
import CustomNoRowsOverlay from '../DataGrid/CustomNoRowsOverlay';
import CustomLoadingOverlay from '../DataGrid/CustomLoadingOverlay';
import CustomPagination from '../DataGrid/CustomPagination';
import { useSelector } from 'react-redux';



const useStyles = makeStyles((theme) => ({
  root: {},
}));


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
                    'organization': msg.relationships.organization.data.attributes.short_name,
                    'period': periodList.find(item => {
                        return Number(item?.id) === msg.attributes.period_id;
                    })?.attributes.name,
                    'text': msg.attributes.text,
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