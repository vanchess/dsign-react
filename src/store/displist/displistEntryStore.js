import { createAction } from '@reduxjs/toolkit'
import { displistService } from '../../services';
import { GridRowModes } from '@mui/x-data-grid';

export const displistEntriesGetRequest = createAction('DISPLIST_ENTRIES_GET_REQUEST');
export const displistEntriesGetSuccess = createAction('DISPLIST_ENTRIES_GET_SUCCESS');
export const displistEntriesGetFailure = createAction('DISPLIST_ENTRIES_GET_FAILURE');
export const displistAddEntry    = createAction('DISPLIST_ENTRIES_ADD_ENTRY');
export const displistUpdateEntryRequest = createAction('DISPLIST_ENTRIES_UPDATE_ENTRY_REQUEST');
export const displistUpdateEntrySuccess = createAction('DISPLIST_ENTRIES_UPDATE_ENTRY_SUCCESS');
export const displistUpdateEntryFailure = createAction('DISPLIST_ENTRIES_UPDATE_ENTRY_FAILURE');
export const displistDeleteEntryRequest = createAction('DISPLIST_ENTRIES_DELETE_ENTRY_REQUEST');
export const displistDeleteEntrySuccess = createAction('DISPLIST_ENTRIES_DELETE_ENTRY_SUCCESS');
export const displistDeleteEntryFailure = createAction('DISPLIST_ENTRIES_DELETE_ENTRY_FAILURE');
export const displistUpdateRowModesModel = createAction('DISPLIST_ENTRIES_UPDATE_ROW_MODES_MODEL');
export const displistSetRowModesModel = createAction('DISPLIST_ENTRIES_SET_ROW_MODES_MODEL');


export const displistEntriesFetch = ({id:displistId}) => {
  return async (dispatch) => {
    dispatch(displistEntriesGetRequest({displistId}));
    
    try {
      let data = await displistService.getEntries(displistId);
      dispatch(displistEntriesGetSuccess({displistId, entries: data.entities}));
    } catch (error) {
      dispatch(displistEntriesGetFailure({displistId, ...error}));
    }
  }
}

export const displistUpdateEntry = ({dbStatus, id, displist_id, first_name, middle_name, last_name, birthday, enp, snils, preventive_medical_measure_id, description, contact_info, error}) => {
  return async (dispatch) => {
    dispatch(displistUpdateEntryRequest({id, displist_id, first_name, middle_name, last_name, birthday, enp, snils, preventive_medical_measure_id, description, contact_info}));
    
    try {
      if (error) throw error;

      let data;
      if (dbStatus === 'notExist') {
        data = await displistService.addEntry(displist_id, {id, first_name, middle_name, last_name, birthday, enp, snils, preventive_medical_measure_id, description, contact_info});
      } else {
        data = await displistService.updateEntry(displist_id, {id, first_name, middle_name, last_name, birthday, enp, snils, preventive_medical_measure_id, description, contact_info});
      }

      dispatch(displistUpdateEntrySuccess({ ...data.data }));
    } catch (error) {
      dispatch(displistUpdateEntryFailure({id, displist_id, first_name, middle_name, last_name, birthday, enp, snils, preventive_medical_measure_id, description, contact_info, dbStatus, error}));
    }
  }
}

export const displistDeleteEntry = ({id, displist_id, dbStatus}) => {
  return async (dispatch) => {
    dispatch(displistDeleteEntryRequest({id, displist_id}));
    
    try {
      let data;
      if (dbStatus !== 'notExist') {
        data = await displistService.deleteEntry(displist_id, id);
      }
      dispatch(displistDeleteEntrySuccess({ displist_id, id, dbStatus }));
    } catch (error) {
      dispatch(displistDeleteEntryFailure({id, displist_id, error}));
    }
  }
}


/* Reducer */
const initialState = {
  list: {},
  loading: false,
  error: false,
};

export function displistEntriesReducer(state = initialState, action) {
  switch (action.type) {
    case displistEntriesGetRequest.type:  
    return { ...state,
      list: { ...state.list,
            [action.payload.displistId]: { ...state.list[action.payload.displistId],
                loading: true
            }
        }
    };
    case displistEntriesGetSuccess.type:
    return { ...state,
      list: { ...state.list,
            [action.payload.displistId]: { ...state.list[action.payload.displistId],
                entries: action.payload.entries,
                error: false,
                loading: false,
                rowModesModel: {}
            }
        }
    };
    case displistEntriesGetFailure.type:
    return { ...state,
      list: { ...state.list,
            [action.payload.displistId]: { ...state.list[action.payload.displistId],
                error: action.payload.error,
                loading: false
            }
        }
    };
    case displistAddEntry.type:
    return {
      list: { ...state.list,
        [action.payload.displist_id]: { ...state.list[action.payload.displist_id],
            entries: [ ...state.list[action.payload.displist_id].entries,
                { ...action.payload, isNew:true, dbStatus:'notExist', }
            ],
            rowModesModel: { ...state.list[action.payload.displist_id]?.rowModesModel,
              [action.payload.id]: { mode: GridRowModes.Edit, fieldToFocus: 'last_name' }
            }
        }
      }
    };
    case displistUpdateEntryRequest.type:
    return {
      list: { ...state.list,
        [action.payload.displist_id]: { ...state.list[action.payload.displist_id],
            entries: state.list[action.payload.displist_id].entries.map((row) => (row.id === action.payload.id ? { dbStatus:'saving', ...action.payload } : row)),
        }
      }
    };
    case displistUpdateEntrySuccess.type:
    return {
      list: { ...state.list,
        [action.payload.displist_id]: { ...state.list[action.payload.displist_id],
            entries: state.list[action.payload.displist_id].entries.map((row) => (row.id === action.payload.id ? { isNew:false, dbStatus:'saved', ...action.payload } : row)),
        }
      }
    };
    case displistUpdateEntryFailure.type:
    return {
      list: { ...state.list,
        [action.payload.displist_id]: { ...state.list[action.payload.displist_id],
            entries: state.list[action.payload.displist_id].entries.map((row) => (row.id === action.payload.id ? { ...action.payload, dbStatus:(action.payload.dbStatus === 'notExist')?'notExist':'notSaved' } : row)),
        }
      }
    };
    case displistDeleteEntryRequest.type:
    return {
      list: { ...state.list,
        [action.payload.displist_id]: { ...state.list[action.payload.displist_id],
            entries: state.list[action.payload.displist_id].entries.map((row) => (row.id === action.payload.id ? { ...row, dbStatus:'beingDeleted'  } : row)),
        }
      }
    };
    case displistDeleteEntrySuccess.type:
      return {
        list: { ...state.list,
          [action.payload.displist_id]: { ...state.list[action.payload.displist_id],
              entries: state.list[action.payload.displist_id].entries.filter((row) => row.id !== action.payload.id),
          }
        }
      };
    case displistDeleteEntryFailure.type:
      return {
        list: { ...state.list,
          [action.payload.displist_id]: { ...state.list[action.payload.displist_id],
              entries: state.list[action.payload.displist_id].entries.map((row) => (row.id === action.payload.id ? { ...row, dbStatus:'error'  } : row)),
          }
        }
      };
    case displistUpdateRowModesModel.type:
      return {
        list: { ...state.list,
          [action.payload.displistId]: { ...state.list[action.payload.displistId],
              rowModesModel: { ...state.list[action.payload.displistId].rowModesModel,
                [action.payload.rowId]: action.payload
              }
          }
        }
      };
    case displistSetRowModesModel.type:
      return {
        list: { ...state.list,
          [action.payload.displistId]: { ...state.list[action.payload.displistId],
              rowModesModel: { ...action.payload.newRowModesModel }
          }
        }
      };
    default:
        return state;
  }
}