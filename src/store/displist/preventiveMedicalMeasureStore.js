import { createAction } from '@reduxjs/toolkit'
import { preventiveMedicalMeasureService } from '../../services';

export const preventiveMedicalMeasureGetRequest = createAction('PREVENTIVE_MEDICAL_MEASURE_GET_REQUEST');
export const preventiveMedicalMeasureGetSuccess = createAction('PREVENTIVE_MEDICAL_MEASURE_GET_SUCCESS');
export const preventiveMedicalMeasureGetFailure = createAction('PREVENTIVE_MEDICAL_MEASURE_GET_FAILURE');

export const preventiveMedicalMeasureFetch = () => {
  return async (dispatch) => {
    dispatch(preventiveMedicalMeasureGetRequest());
    
    try {
      let data = await preventiveMedicalMeasureService.getAll();
      dispatch(preventiveMedicalMeasureGetSuccess({entities: data.entities}));
    } catch (error) {
      dispatch(preventiveMedicalMeasureGetFailure({...error}));
    }
  }
}

/* Reducer */
const initialState = {
  entities: {},
  ids: [],
  loading: false,
  error: false,
};

export function preventiveMedicalMeasureReducer(state = initialState, action) {
  switch (action.type) {
    case preventiveMedicalMeasureGetRequest.type:
      return { ...state,
        loading: true
      };
    case preventiveMedicalMeasureGetSuccess.type:  
      return { ...state,
        entities: action.payload.entities.reduce((o, item) => {o[item.id] = item; return o;}, {}),
        ids: action.payload.entities.map(e => e.id),
        loading: false
      };
    case preventiveMedicalMeasureGetFailure.type:
      return { ...state,
        error: action.error,
        loading: false
      };
    default:
      return state
  }
}