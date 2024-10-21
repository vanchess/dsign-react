import { createAction } from '@reduxjs/toolkit'
import { dnService } from '../../services';
import { GridRowModes } from '@mui/x-data-grid';

export const dnlistEntriesGetRequest = createAction('DNLIST_ENTRIES_GET_REQUEST');
export const dnlistEntriesGetSuccess = createAction('DNLIST_ENTRIES_GET_SUCCESS');
export const dnlistEntriesGetFailure = createAction('DNLIST_ENTRIES_GET_FAILURE');
export const dnlistAddEntry    = createAction('DNLIST_ENTRIES_ADD_ENTRY');
export const dnlistUpdateEntryRequest = createAction('DNLIST_ENTRIES_UPDATE_ENTRY_REQUEST');
export const dnlistUpdateEntrySuccess = createAction('DNLIST_ENTRIES_UPDATE_ENTRY_SUCCESS');
export const dnlistUpdateEntryFailure = createAction('DNLIST_ENTRIES_UPDATE_ENTRY_FAILURE');
export const dnlistDeleteEntryRequest = createAction('DNLIST_ENTRIES_DELETE_ENTRY_REQUEST');
export const dnlistDeleteEntrySuccess = createAction('DNLIST_ENTRIES_DELETE_ENTRY_SUCCESS');
export const dnlistDeleteEntryFailure = createAction('DNLIST_ENTRIES_DELETE_ENTRY_FAILURE');
export const dnlistUpdateRowModesModel = createAction('DNLIST_ENTRIES_UPDATE_ROW_MODES_MODEL');
export const dnlistSetRowModesModel = createAction('DNLIST_ENTRIES_SET_ROW_MODES_MODEL');
export const dnlistDiscardUnsavedChanges = createAction('DNLIST_ENTRIES_DISCARD_UNSAVED_CHANGES')


export const dnlistEntriesFetch = ({id:dnlistId}) => {
  return async (dispatch) => {
    dispatch(dnlistEntriesGetRequest({dnlistId}));
    
    try {
      let data = await dnService.getEntries(dnlistId);
      dispatch(dnlistEntriesGetSuccess({dnlistId, entries: data.entities}));
    } catch (error) {
      dispatch(dnlistEntriesGetFailure({dnlistId, ...error}));
    }
  }
}

export const dnlistUpdateEntry = ({dbStatus, id, dn_list_id, first_name, middle_name, last_name, birthday, enp, snils, preventive_medical_measure_id, description, contact_info, error}) => {
  return async (dispatch) => {
    dispatch(dnlistUpdateEntryRequest({id, dn_list_id, first_name, middle_name, last_name, birthday, enp, snils, preventive_medical_measure_id, description, contact_info}));
    
    try {
      if (error) throw error;

      let data;
      if (dbStatus === 'notExist') {
        data = await dnService.addEntry(dn_list_id, {id, first_name, middle_name, last_name, birthday, enp, snils, preventive_medical_measure_id, description, contact_info});
      } else {
        data = await dnService.updateEntry(dn_list_id, {id, first_name, middle_name, last_name, birthday, enp, snils, preventive_medical_measure_id, description, contact_info});
      }

      dispatch(dnlistUpdateEntrySuccess({ ...data.data }));
    } catch (error) {
      dispatch(dnlistUpdateEntryFailure({id, dn_list_id, first_name, middle_name, last_name, birthday, enp, snils, preventive_medical_measure_id, description, contact_info, dbStatus, error}));
    }
  }
}

export const dnlistDeleteEntry = ({id, dn_list_id, dbStatus}) => {
  return async (dispatch) => {
    dispatch(dnlistDeleteEntryRequest({id, dn_list_id}));
    
    try {
      let data;
      if (dbStatus !== 'notExist') {
        data = await dnService.deleteEntry(dn_list_id, id);
      }
      dispatch(dnlistDeleteEntrySuccess({ dn_list_id, id, dbStatus }));
    } catch (error) {
      dispatch(dnlistDeleteEntryFailure({id, dn_list_id, error}));
    }
  }
}


/* Reducer */
const initialState = {
  list: {},
  loading: false,
  error: false,
};

export function dnListEntriesReducer(state = initialState, action) {
  switch (action.type) {
    case dnlistEntriesGetRequest.type:  
    return { ...state,
      list: { ...state.list,
            [action.payload.dnlistId]: { ...state.list[action.payload.dnlistId],
                loading: true
            }
        }
    };
    case dnlistEntriesGetSuccess.type:
    return { ...state,
      list: { ...state.list,
            [action.payload.dnlistId]: { ...state.list[action.payload.dnlistId],
                entries: action.payload.entries,
                error: false,
                loading: false,
                rowModesModel: {}
            }
        }
    };
    case dnlistEntriesGetFailure.type:
    return { ...state,
      list: { ...state.list,
            [action.payload.dnlistId]: { ...state.list[action.payload.dnlistId],
                error: action.payload.error,
                loading: false
            }
        }
    };
    case dnlistAddEntry.type:
    return {
      list: { ...state.list,
        [action.payload.dn_list_id]: { ...state.list[action.payload.dn_list_id],
            entries: [ ...state.list[action.payload.dn_list_id].entries,
                { ...action.payload, isNew:true, dbStatus:'notExist', }
            ],
            rowModesModel: { ...state.list[action.payload.dn_list_id]?.rowModesModel,
              [action.payload.id]: { mode: GridRowModes.Edit, fieldToFocus: 'last_name' }
            }
        }
      }
    };
    case dnlistUpdateEntryRequest.type:
    return {
      list: { ...state.list,
        [action.payload.dn_list_id]: { ...state.list[action.payload.dn_list_id],
            entries: state.list[action.payload.dn_list_id].entries.map((row) => (row.id === action.payload.id ? { dbStatus:'saving', ...action.payload } : row)),
        }
      }
    };
    case dnlistUpdateEntrySuccess.type:
    return {
      list: { ...state.list,
        [action.payload.dn_list_id]: { ...state.list[action.payload.dn_list_id],
            entries: state.list[action.payload.dn_list_id].entries.map((row) => (row.id === action.payload.id ? { isNew:false, dbStatus:'saved', ...action.payload } : row)),
        }
      }
    };
    case dnlistUpdateEntryFailure.type:
    return {
      list: { ...state.list,
        [action.payload.dn_list_id]: { ...state.list[action.payload.dn_list_id],
            entries: state.list[action.payload.dn_list_id].entries.map((row) => (row.id === action.payload.id ? { ...action.payload, dbStatus:(action.payload.dbStatus === 'notExist')?'notExist':'notSaved' } : row)),
        }
      }
    };
    case dnlistDeleteEntryRequest.type:
    return {
      list: { ...state.list,
        [action.payload.dn_list_id]: { ...state.list[action.payload.dn_list_id],
            entries: state.list[action.payload.dn_list_id].entries.map((row) => (row.id === action.payload.id ? { ...row, dbStatus:'beingDeleted'  } : row)),
        }
      }
    };
    case dnlistDeleteEntrySuccess.type:
      return {
        list: { ...state.list,
          [action.payload.dn_list_id]: { ...state.list[action.payload.dn_list_id],
              entries: state.list[action.payload.dn_list_id].entries.filter((row) => row.id !== action.payload.id),
          }
        }
      };
    case dnlistDeleteEntryFailure.type:
      return {
        list: { ...state.list,
          [action.payload.dn_list_id]: { ...state.list[action.payload.dn_list_id],
              entries: state.list[action.payload.dn_list_id].entries.map((row) => (row.id === action.payload.id ? { ...row, dbStatus:'error'  } : row)),
          }
        }
      };
    case dnlistUpdateRowModesModel.type:
      return {
        list: { ...state.list,
          [action.payload.dnlistId]: { ...state.list[action.payload.dnlistId],
              rowModesModel: { ...state.list[action.payload.dnlistId].rowModesModel,
                [action.payload.rowId]: action.payload
              }
          }
        }
      };
    case dnlistSetRowModesModel.type:
      return {
        list: { ...state.list,
          [action.payload.dnlistId]: { ...state.list[action.payload.dnlistId],
              rowModesModel: { ...action.payload.newRowModesModel }
          }
        }
      };
    case dnlistDiscardUnsavedChanges.type:
      return {
        list: { ...state.list,
          [action.payload.dnlistId]: { ...state.list[action.payload.dnlistId],
            entries: state.list[action.payload.dnlistId].entries?.filter(en => !en.isNew),
            rowModesModel: state.list[action.payload.dnlistId].rowModesModel ?
                            Object.keys(state.list[action.payload.dnlistId].rowModesModel).reduce((rmm, id) => { 
                              rmm[id] = { ...state.list[action.payload.dnlistId].rowModesModel[id], mode: GridRowModes.View, ignoreModifications: true}; 
                              return rmm;
                            }, {})
                            : state.list[action.payload.dnlistId].rowModesModel
          }
        }
      }
    default:
        return state;
  }
}