import { DataGrid } from '@mui/x-data-grid';
import React from "react";
import CustomLoadingOverlay from "../DataGrid/CustomLoadingOverlay";
import CustomNoRowsOverlay from "../DataGrid/CustomNoRowsOverlay";
import CustomPagination from "../DataGrid/CustomPagination";
import CustomToolbar from "../DataGrid/CustomToolbar";

export default function UserList(props) {
    const {items} = props;

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
                    items.map((item) => {
                        return ({
                            id: item.id, 
                            'name': item.attributes.name,
                            'fio': `${item.attributes.last_name} ${item.attributes.first_name} ${item.attributes.middle_name}`,
                            'job_title_branch': `${item.attributes.job_title} (${item.attributes.branch})`,
                            'email': item.attributes.email,
                            'roles': item.relationships.roles.data.reduce((res,c) => {
                                let name = c.attributes.name;
                                if (name === 'mo-lider') {
                                    name = 'Руководитель МО';
                                }
                                if (name === 'mo-chief-accountant') {
                                    name = 'Главный бухгалтер МО';
                                }
                                res[c.id] = {name: name};
                                return res;
                              }, []),
                        });
                    }).filter(item => item != null)
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