import { DataGrid, GridRowModes, GridActionsCellItem, GridRowEditStopReasons, GridEditInputCell } from '@mui/x-data-grid';
import React, { useEffect, useMemo } from "react";
import CustomLoadingOverlay from "../DataGrid/CustomLoadingOverlay";
import CustomNoRowsOverlay from "../DataGrid/CustomNoRowsOverlay";
import CustomPagination from "../DataGrid/CustomPagination";
import EditToolbar from './EditToolbar.js'
import CustomToolbar from '../DataGrid/CustomToolbar';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import EditInputCell from './EditInputCell.js';
import AddIcon from '@mui/icons-material/Add';
import ControlPointDuplicateIcon from '@mui/icons-material/ControlPointDuplicate';
import Snackbar from '@mui/material/Snackbar';
import { Alert, Button } from '@mui/material';
import { uuidv4 } from '../../_helpers/uniqueId';
import { validate } from '../../_helpers/validate.js';
import { useDispatch, useSelector } from 'react-redux';
import { displistEntriesSelector, rowModesModelSelector } from '../../store/displist/displistEntrySelector.js';
import { displistAddEntry, displistDeleteEntry, displistEntriesFetch, displistSetRowModesModel, displistUpdateEntry, displistUpdateRowModesModel, updateRowModesModel } from '../../store/displist/displistEntryStore.js';
import { preventiveMedicalMeasureTypesIdsSelector, preventiveMedicalMeasureTypesSelector } from '../../store/displist/preventiveMedicalMeasureSelector.js';
import styled from '@emotion/styled';

const StyledBox = styled('div')(({ theme }) => ({
  /*
  '& .MuiDataGrid-cell--editable': {
    backgroundColor: theme.palette.mode === 'dark' ? '#376331' : 'rgb(217 243 190)',
    '& .MuiInputBase-root': {
      height: '100%',
    },
  },
  */
  '& .Mui-error': {
    backgroundColor: `rgb(126,10,15, ${theme.palette.mode === 'dark' ? 0 : 0.1})`,
    color: theme.palette.mode === 'dark' ? '#ff4343' : '#750f0f',
  },
  '& .displist-row--saving, & .displist-row--being-deleted': {
    color: theme.palette.warning.main,
  },
  '& .displist-row--error': {
    backgroundColor: `rgb(126,10,15, ${theme.palette.mode === 'dark' ? 0 : 0.1})`,
    color: theme.palette.mode === 'dark' ? '#ff4343' : '#750f0f',
  },
}));

export default function DnDataGrid(props) {
    const dispatch = useDispatch();
    const {listId:displistId, isDraft} = props;
    const [snackbar, setSnackbar] = React.useState(null);
    const rowModesModel = useSelector((store) => rowModesModelSelector(store, displistId));
    const rows = useSelector((store) => displistEntriesSelector(store, displistId));
    const preventiveMedicalMeasureTypes = useSelector(preventiveMedicalMeasureTypesSelector);
    const preventiveMedicalMeasureTypesIds = useSelector(preventiveMedicalMeasureTypesIdsSelector);

    useEffect(() => {
      if (displistId) {
        dispatch(displistEntriesFetch({id:displistId}));
      }
    }, [displistId])
    
    

    const renderEditCell = (params) => {
      return <EditInputCell {...params} error={params.error} />;
    }

    const handleEditClick = (id) => () => {
      if (rowsHasError(id)) return;

      dispatch(displistUpdateRowModesModel({ displistId, rowId:id, mode: GridRowModes.Edit }));
    };
    const handleSaveClick = (id, row) => () => {
      dispatch(displistUpdateRowModesModel({ displistId, rowId:id, mode: GridRowModes.View }));
    };

    const handleDeleteClick = (id, dbStatus) => () => {
      dispatch(displistDeleteEntry({displist_id:displistId, id, dbStatus}));
    };
    const handleCancelClick = (id, dbStatus) => () => {
      dispatch(displistUpdateRowModesModel({ displistId, rowId:id, mode: GridRowModes.View, ignoreModifications: true }));
    
      const editedRow = rows.find((row) => row.id === id);
      if (editedRow.isNew) {
        dispatch(displistDeleteEntry({displist_id:displistId, id, dbStatus}));
      }
    };
    const handleCopyClick = (row) => () => copyRow(row);

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
        if (!newRow.birthday) {
          error += 'Дата рождения;';
        }
        if (!newRow.enp) {
          error += 'ЕНП;';
        }
        if (!newRow.snils) {
          error += 'СНИЛС;';
        }
        if (!preventiveMedicalMeasureTypesIds.some(p => p === newRow.preventive_medical_measure_id)) {
          error += 'Вид планируемого мероприятия;';
        }

        if (!error && (newRow.birthday < new Date(1900,1,1) || newRow.birthday > Date.now())) {
          error = 'Дата рождения указана неверно;';
        }

        if (error) {       
            setSnackbar({ children: `Необходимо заполнить данные (${error})!`, severity: 'warning' });
            dispatch(displistUpdateRowModesModel({ displistId, rowId:newRow.id, mode: GridRowModes.Edit }));
            updatedRow = { ...newRow, isNew: false, error: true };
        } else {
            updatedRow = { ...newRow, isNew: false, error: false };
            
        }

        dispatch(displistUpdateEntry(updatedRow));
        return updatedRow;
    };
    
    const handleRowModesModelChange = (newRowModesModel) => {
      dispatch(displistSetRowModesModel({displistId, newRowModesModel}));
    };

    const rowsHasError = (id) => {
      if (Object.values(rowModesModel).some(m => m.mode === GridRowModes.Edit)) {
        setSnackbar({ children: 'Необходимо заполнить и сохранить данные!', severity: 'warning' });
        return true;
      }
      if (rows.some(r => (r.error && r.id !== id))) {
        setSnackbar({ children: 'Введены некорректные данные. Необходимо исправить и сохранить данные!', severity: 'warning' });
        return true;
      }
      return false;
    }

    const addRow = () => {
        if (rowsHasError()) return;
        
        const id = uuidv4();
        
        dispatch(displistAddEntry({
          displist_id:displistId,
          id, 
          first_name:'', 
          middle_name:'', 
          last_name:'', 
          birthday:'', 
          enp:'', 
          snils:'', 
          preventive_medical_measure_id:'', 
          //description, 
          //contact_info,
          type: '', 
          isNew: true,
        }))
      };

    const copyRow = (row) => {
        if (rowsHasError()) return;
          
        const id = uuidv4();

        dispatch(displistAddEntry({
          displist_id:displistId,
          id, 
          first_name: row.first_name, 
          middle_name: row.middle_name, 
          last_name: row.last_name, 
          birthday: row.birthday, 
          enp: row.enp, 
          snils: row.snils, 
          preventive_medical_measure_id:'', 
          //description, 
          contact_info:row.contact_info,
          type: '', 
          isNew: true,
        }))
      }

    const handleCloseSnackbar = () => setSnackbar(null);

    return (
        <StyledBox>
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
                getRowClassName={(params) => `${params.row.error?'displist-row--error':''} ${params.row.dbStatus==='saving'?'displist-row--saving':''} ${params.row.dbStatus==='beingDeleted'?'displist-row--being-deleted':''}`}
                columns={[
                    { field: 'id', headerName: 'ID', width: 70, editable: false },
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
                    { field: 'middle_name', headerName: 'Отчество', width: 150, editable: true, 
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
                    
                    { field: 'birthday', headerName: 'Дата рождения', editable: true, type: 'date' ,
                      valueGetter: (str) => {
                        return new Date(str)
                      }, 
                    },
                    { field: 'enp', headerName: 'ЕНП', width: 165, editable: true,
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
                      field: 'preventive_medical_measure_id',
                      headerName: 'Вид планируемого мероприятия',
                      width: 220,
                      editable: true,
                      type: 'singleSelect',
                      getOptionValue: (value) => value,
                      getOptionLabel: (value) => {
                        const p = preventiveMedicalMeasureTypes[value];
                        if (p) {
                         return `${p.code} - ${p.name}`
                        }
                        return '';
                      },
                      valueOptions: preventiveMedicalMeasureTypesIds,
                    },
                    { field: 'contact_info', headerName: 'Контактные данные', width: 140, editable: true },
                    {
                      field: 'action',
                      headerName: 'Действия',
                      description: '',
                      type: 'actions',
                      // renderCell: renderOpenButton(onClick),
                      getActions: ({ id, row }) => {
                          if (!isDraft) return [];
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
                                onClick={handleCancelClick(id, row.dbStatus)}
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
                              onClick={handleDeleteClick(id, row.dbStatus)} // 
                              color="inherit"
                            />,
                            <GridActionsCellItem
                              icon={<ControlPointDuplicateIcon />}
                              label="Copy"
                              onClick={handleCopyClick(row)} // 
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
                    toolbar: isDraft ? EditToolbar : CustomToolbar,
                    loadingOverlay: CustomLoadingOverlay,
                    noRowsOverlay: CustomNoRowsOverlay,
                   // pagination: CustomPagination,
                }}
                slotProps={{
                    toolbar: { addRow }
                }}
            />
            {(isDraft)?
            <Button color="primary" startIcon={<AddIcon />} onClick={addRow}>
              Добавить запись
            </Button>
            :null}
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
        </StyledBox>
    );
}