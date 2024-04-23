import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
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
      {
        field: 'category',
        headerName: 'Категория',
        description: 'Категория',
        valueFormatter: (params) => {
          return ( params.value?.map( (c) => c.short_title).join())
        },
        renderCell: (params) => {
            return ( params.value.map( (c) => 
                (<Chip key={c.name} label={c.short_title}/>)
            ))
        }
        ,
        // filterOperators: [inOperator(statuses), notInOperator(statuses)],
        width: 150,
        sortable: false,
        filterable: false
      },
      { field: 'period', headerName: 'Период', width: 140 },
      {
        field: 'createdAt',
        headerName: 'Дата',
        type: 'date',
        valueFormatter: (params) =>
          moment(params.value, "YYYY-MM-DDTHH:mm:ss.SSSSSSZ").local().format("DD.MM.YYYY HH:mm"),
        width: 150,
        //filterable: false
      },
      {
        field: 'status',
        headerName: 'Статус',
        description: 'Статус',
        type: 'singleSelect',
        valueFormatter: (params) => params.value?.lable,
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
        //filterOperators: statusOnlyOperators,
        width: 150,
        sortable: false,
        filterable: false,
        disableExport: true
      },
      /*
      {
        field: 'fullName',
        headerName: 'Full name',
        description: 'This column has a value getter and is not sortable.',
        sortable: false,
        width: 160,
        valueGetter: (params) =>
          `${params.getValue('firstName') || ''} ${params.getValue('lastName') || ''}`,
      },*/
    ];
}