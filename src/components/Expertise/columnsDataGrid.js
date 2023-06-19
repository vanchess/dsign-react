import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
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
    columns.push({ field: 'id', headerName: 'ID', width: 70, hide: true });
    columns.push({ field: 'from', headerName: 'Отправитель', flex: 1 });
    if (msgType === 'mek') {
      columns.push(
        {
          field: 'category',
          headerName: 'Категория',
          description: 'Категория',
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
        }
      );
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
        valueFormatter: (params: ValueFormatterParams) =>
          moment(params.value, "YYYY-MM-DDTHH:mm:ss.SSSSSSZ").local().format("DD.MM.YYYY HH:mm"),
        width: 150,
        //filterable: false
      }
    );
    columns.push(
      {
        field: 'status',
        headerName: 'Статус',
        description: 'Статус',
        renderCell: (params: GridCellParams) => (
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
        //filterOperators: statusOnlyOperators,
        width: 150,
        sortable: false,
        filterable: false
      }
    );

    return columns;
}