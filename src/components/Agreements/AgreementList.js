import * as React from 'react';
import { 
    DataGrid, 
    getGridNumericColumnOperators
} from '@material-ui/data-grid';

import { makeStyles } from '@material-ui/core/styles';

import CustomToolbar from '../DataGrid/CustomToolbar';
import CustomNoRowsOverlay from '../DataGrid/CustomNoRowsOverlay';
import CustomLoadingOverlay from '../DataGrid/CustomLoadingOverlay';
import CustomPagination from '../DataGrid/CustomPagination';



const useStyles = makeStyles((theme) => ({
  root: {},
}));


export default function BillList(props) {
 
  return (
    <div style={{ minHeight: '400px', height: 'calc(100vh - 128px)',width: '100%' }}>
      
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
                    'organization': msg.relationships.organization.data.attributes.short_name,
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