import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';

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

export const createColumns = (onClick) => {
    return [
      { field: 'id', headerName: 'ID', width: 70, hide: true },
      { field: 'name', headerName: 'Имя абонента', flex: 1 },
      { field: 'fio', headerName: 'ФИО', flex: 1 },
      { field: 'job_title_branch', headerName: 'Должность (Отдел организации)', flex: 1 },
      { field: 'email', headerName: 'Электронная почта' },

      {
        field: 'roles',
        headerName: 'Роли',
        description: 'Роли',
        renderCell: (params) => {
            return ( params.value.map( (c) => 
                (<Chip key={c.name} label={c.name}/>)
            ))
        }
        ,
        // filterOperators: [inOperator(statuses), notInOperator(statuses)],
        width: 150,
        sortable: false,
        filterable: false,
        flex: 1
      },
      {
        field: 'action',
        headerName: 'Действия',
        description: '',
        renderCell: renderOpenButton(onClick),
        //filterOperators: statusOnlyOperators,
        width: 150,
        sortable: false,
        filterable: false
      },
    ];
}