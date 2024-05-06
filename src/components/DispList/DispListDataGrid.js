import { DataGrid, GridRowModes, GridActionsCellItem, GridRowEditStopReasons, GridEditInputCell } from '@mui/x-data-grid';
import React, { useMemo } from "react";
import CustomLoadingOverlay from "../DataGrid/CustomLoadingOverlay";
import CustomNoRowsOverlay from "../DataGrid/CustomNoRowsOverlay";
import CustomPagination from "../DataGrid/CustomPagination";
import EditToolbar from './EditToolbar.js'
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import EditInputCell from './EditInputCell.js';
import Snackbar from '@mui/material/Snackbar';
import { Alert } from '@mui/material';
import { uniqueId } from '../../_helpers/uniqueId';
import { validate } from '../../_helpers/validate.js';

export default function DispListDataGrid(props) {
    const {items} = props;
    const [snackbar, setSnackbar] = React.useState(null);
    const [rows, setRows] = React.useState([]);
    const [rowModesModel, setRowModesModel] = React.useState({});

    const preventiveMedicalMeasureTypes = useMemo(() => (
      [
        {value:0, name:'диспансеризация взрослого населения'}, 
        {value:3, name:'профосмотр взрослого населения'}, 
        {value:8, name:'углубленная диспансеризация'}
      ]
    ), []);

    const renderEditCell = (params) => {
      return <EditInputCell {...params} error={params.error} />;
    }

    const handleEditClick = (id) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
    };
    const handleSaveClick = (id, row) => () => {
        setRowModesModel(oldModel => ({ ...oldModel, [id]: { mode: GridRowModes.View } }));
    };

    const handleDeleteClick = (id) => () => {
        setRows(rows.filter((row) => row.id !== id));
    };
    const handleCancelClick = (id) => () => {
        setRowModesModel({
          ...rowModesModel,
          [id]: { mode: GridRowModes.View, ignoreModifications: true },
        });
    
        const editedRow = rows.find((row) => row.id === id);
        if (editedRow.isNew) {
          setRows(rows.filter((row) => row.id !== id));
        }
    };

    const handleRowEditStop = (params, event) => {
        if (params.reason === GridRowEditStopReasons.rowFocusOut) {
          event.defaultMuiPrevented = true;
        }
    };

    const processRowUpdate = (newRow, oldRow) => {
        let updatedRow;
        let error = '';
        if (!newRow.last_name) {
          error += 'Фамилия;';
        }
        if (!newRow.first_name) {
          error += 'Имя;';
        }
        if (!newRow.dob) {
          error += 'Дата рождения;';
        }
        if (!newRow.emp) {
          error += 'ЕНП;';
        }
        if (!newRow.snils) {
          error += 'СНИЛС;';
        }
        if (!preventiveMedicalMeasureTypes.some(p => p.value === newRow.type)) {
          error += 'Вид планируемого мероприятия;';
        }

        if (error) {
            
            setSnackbar({ children: `Необходимо заполнить данные (${error})!`, severity: 'warning' });

            setRowModesModel(oldModel => {
                let v = ({ ...oldModel, [newRow.id]: { mode: GridRowModes.Edit } });
                return v;
            });
            updatedRow = { ...newRow, isNew: false, error: true };
        } else {
            updatedRow = { ...newRow, isNew: false, error: false };
        }

        setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));  
        return updatedRow;
    };
    
    const handleRowModesModelChange = (newRowModesModel) => {
      console.log('handleRowModesModelChange');
      console.log(newRowModesModel);
      console.log(rows);
      setRowModesModel(newRowModesModel);
    };

    const addRow = () => {
        if (Object.values(rowModesModel).some(m => m.mode === GridRowModes.Edit)) {
          setSnackbar({ children: 'Необходимо заполнить данные!', severity: 'warning' });
          return;
        }
        if (rows.some(r => r.error)) {
          setSnackbar({ children: 'Введены некорректные данные. Добавление новой записи невозможно.', severity: 'warning' });
          return;
        }

        const id = uniqueId();
        setRows((oldRows) => [...oldRows, { 
          id, 
          last_name: '', 
          first_name: '', 
          surname: '', 
          dob: null, 
          emp: '', 
          snils: '', 
          type: '', 
          isNew: true,
          // error: null 
      }]);
        setRowModesModel((oldModel) => ({
          ...oldModel,
          [id]: { mode: GridRowModes.Edit, fieldToFocus: 'last_name' },
        }));
      };

    const handleCloseSnackbar = () => setSnackbar(null);

    return (
        <>
            <DataGrid
                autoHeight 
                editMode="row"
                rowModesModel={rowModesModel}
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
                onRowModesModelChange={handleRowModesModelChange}
                onRowEditStop={handleRowEditStop}
                processRowUpdate={processRowUpdate}
                rows = {rows}
                columns={[
                    { field: 'id', headerName: 'ID', width: 70, type: 'number', editable: false },
                    { field: 'last_name', headerName: 'Фамилия', width: 200, editable: true,
                        preProcessEditCellProps: (params) => {
                            if (!params.hasChanged) {
                              return { ...params.props };
                            }
                            const v = params.props.value;
                            if (v.length < 1) {
                              return { ...params.props, error: 'Заполните это поле' };
                            }
                            if (/[^А-Яа-яЁё \-]/.test(v)) {
                              return { ...params.props, error: 'может состоять только из букв русского алфавита' };
                            }
                            return {...params.props, error: ''};
                        },
                        renderEditCell
                    },
                    { field: 'first_name', headerName: 'Имя', width: 140, editable: true,
                        preProcessEditCellProps: (params) => {
                            if (!params.hasChanged) {
                              return { ...params.props };
                            }
                            const v = params.props.value;
                            if (v.length < 1) {
                              return { ...params.props, error: 'Заполните это поле' };
                            }
                            if (/[^А-Яа-яЁё \-]/.test(v)) {
                              return { ...params.props, error: 'может состоять только из букв русского алфавита' };
                            }
                            return {...params.props, error: ''};
                        },
                        renderEditCell
                    },
                    { field: 'surname', headerName: 'Отчество', width: 150, editable: true, 
                        preProcessEditCellProps: (params) => {
                            if (!params.hasChanged) {
                              return { ...params.props };
                            }
                            const v = params.props.value;
                            if (/[^А-Яа-яЁё \-]/.test(v)) {
                              return { ...params.props, error: 'может состоять только из букв русского алфавита' };
                            }
                            return {...params.props, error: ''};
                        },
                        renderEditCell
                    },
                    
                    { field: 'dob', headerName: 'Дата рождения', editable: true, type: 'date' },
                    { field: 'emp', headerName: 'ЕНП', width: 165, editable: true,
                        preProcessEditCellProps: (params) => {
                          if (!params.hasChanged) {
                            return { ...params.props };
                          }
                          let error = {};
                          if (!validate.enp(params.props.value, error)) {
                            return { ...params.props, error: error.message };
                          }
                          return {...params.props, error: ''};
                        },
                        renderEditCell
                    },
                    { field: 'snils', headerName: 'СНИЛС', width: 140, editable: true,
                        preProcessEditCellProps: (params) => {
                          if (!params.hasChanged) {
                            return { ...params.props };
                          }
                          let error = {};
                          if (!validate.snils(params.props.value, error)) {
                            return { ...params.props, error: error.message };
                          }
                          return {...params.props, error: ''};
                        },
                        renderEditCell
                    },
                    {
                      field: 'type',
                      headerName: 'Вид планируемого мероприятия',
                      width: 220,
                      editable: true,
                      type: 'singleSelect',
                      getOptionValue: (value) => value.value,
                      getOptionLabel: (value) => `${value.value} - ${value.name}`,
                      valueOptions: preventiveMedicalMeasureTypes,
                    },
                    { field: 'tel', headerName: 'Контактные данные', width: 140, editable: true },
                    {
                      field: 'action',
                      headerName: 'Действия',
                      description: '',
                      type: 'actions',
                      // renderCell: renderOpenButton(onClick),
                      getActions: ({ id, row }) => {
                          const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;
                          if (isInEditMode) {
                            return [
                              <GridActionsCellItem
                                icon={<SaveIcon />}
                                label="Save"
                                sx={{
                                  color: 'primary.main',
                                }}
                                onClick={handleSaveClick(id, row)}
                              />,
                              <GridActionsCellItem
                                icon={<CancelIcon />}
                                label="Cancel"
                                className="textPrimary"
                                onClick={handleCancelClick(id)}
                                color="inherit"
                              />,
                            ];
                          }
                          return [
                            <GridActionsCellItem
                              icon={<EditIcon />}
                              label="Edit"
                              className="textPrimary"
                              onClick={handleEditClick(id)}
                              color="inherit"
                            />,
                            <GridActionsCellItem
                              icon={<DeleteIcon />}
                              label="Delete"
                              onClick={handleDeleteClick(id)}
                              color="inherit"
                            />,
                          ];
                      },
                      width: 150,
                      sortable: false,
                      filterable: false,
                      disableExport: true,
                      hideable: false,
                    },
                ]}  
                slots={{
                    toolbar: EditToolbar,
                    loadingOverlay: CustomLoadingOverlay,
                    noRowsOverlay: CustomNoRowsOverlay,
                   // pagination: CustomPagination,
                }}
                slotProps={{
                    toolbar: { addRow }
                }}
            />
            {!!snackbar && (
                <Snackbar
                  open
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                  onClose={handleCloseSnackbar}
                  autoHideDuration={6000}
                >
                  <Alert {...snackbar} onClose={handleCloseSnackbar} />
                </Snackbar>
              )}
        </>
    );
}