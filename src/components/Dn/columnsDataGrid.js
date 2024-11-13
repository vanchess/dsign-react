import Button from '@mui/material/Button';
import moment from 'moment';

import StatusIcon from '../Message/StatusIcon';
import { inOperator, notInOperator } from '../DataGrid/filterOperators.js';

const renderOpenButton = (onClick) => {
    return (params) => { return (
            <strong>
                <Button
                    //variant="contained"
                    //color="primary"
                    size="small"
                    style={{ marginLeft: 16 }}
                    onClick={() => {
                        onClick(params.row.id)
                    }}
                >
                    Открыть
                </Button>
            </strong>
        )
    }
}

export const createColumns = (statuses, onClick) => {

    return [
      { field: 'id', headerName: 'ID', width: 70, hide: true, type: 'number', },
      { field: 'from', headerName: 'От кого', flex: 1 },
      { field: 'subject', headerName: 'Название', width: 250 },
      { field: 'text', headerName: 'ОГРН', width: 150 },
      {
        field: 'createdAt',
        headerName: 'Дата',
         type: 'date',
         valueFormatter: (value) => 
          moment(value, "YYYY-MM-DDTHH:mm:ss.SSSSSSZ").local().format("DD.MM.YYYY HH:mm"),
        width: 150,
      },
      {
        field: 'status',
        headerName: 'Статус',
        description: 'Статус',
        type: 'singleSelect',
        valueFormatter: (value) => value?.lable,
        renderCell: (params) => (
            <StatusIcon label={params.value.lable} name={params.value.name} />
        ),
        filterOperators: [inOperator(statuses), notInOperator(statuses)],
        width: 70,
        sortable: false,
      },
      {
        field: 'action',
        headerName: 'Действия',
        type: 'action',
        description: '',
        renderCell: renderOpenButton(onClick),
        width: 150,
        sortable: false,
        filterable: false,
        disableExport: true,
        hideable: false,
      },
    ];
}