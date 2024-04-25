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
      { field: 'id', headerName: 'ID', width: 70, hide: true, type: 'number' },
      { field: 'from', headerName: 'Отправитель', flex: 1 },
      { field: 'period', headerName: 'Период', width: 140 },
      { field: 'organization', headerName: 'Организация', width: 260 },
      
      {
        field: 'createdAt',
        headerName: 'Дата',
        type: 'date',
        valueFormatter: (value) =>
          moment(value, "YYYY-MM-DDTHH:mm:ss.SSSSSSZ").local().format("DD.MM.YYYY HH:mm"),
        width: 150,
        //filterable: false
      },
      {
        field: 'status',
        headerName: 'Статус',
        description: 'Статус',
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