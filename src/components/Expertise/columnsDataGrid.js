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

export const createColumns = (statuses, onClick, msgType = 'mek') => {
    let columns = [];
    columns.push({ field: 'id', headerName: 'ID', width: 70, hide: true, type: 'number' });
    columns.push({ field: 'from', headerName: 'Отправитель', flex: 1 });
    columns.push(
        {
          field: 'category',
          headerName: 'Категория',
          description: 'Категория',
          valueFormatter: (value) => {
            return ( value?.map( (c) => c.short_title).join())
          },
          renderCell: (params) => {
              return ( params.value.map( (c) => 
                  (<Chip key={c.name} label={c.short_title}/>)
              ))
          }
          ,
          // filterOperators: [inOperator(statuses), notInOperator(statuses)],
          width: 130,
          sortable: false,
          filterable: false
        }
      );
    if (msgType === 'mek') {
      
      columns.push({ field: 'period', headerName: 'Период', width: 80 });
    }

    columns.push({ field: 'organization', headerName: 'Организация', width: 257 });
    if (msgType === 'mee') {
      columns.push({ field: 'subject', headerName: 'Тема', width: 250 });
    }
    columns.push(
      {
        field: 'createdAt',
        headerName: 'Дата',
        type: 'date',
        valueFormatter: (value) =>
          moment(value, "YYYY-MM-DDTHH:mm:ss.SSSSSSZ").local().format("DD.MM.YYYY HH:mm"),
        width: 150,
      }
    );
    columns.push(
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
      }
    );
    columns.push(
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
      }
    );

    return columns;
}