import { MTR_REFUSAL_REASONS_GET_REQUEST, MTR_REFUSAL_REASONS_GET_SUCCESS, MTR_REFUSAL_REASONS_GET_FAILURE } from '../../constants/billConstants.js'

const initialState = {
  items: [],
  loading: false,
  error: false,
};

export function mtrRefusalReasonsReducer(state = initialState, action) {
  switch (action.type) {
    case MTR_REFUSAL_REASONS_GET_REQUEST:
      return { ...state,
        loading: true
      };
    case MTR_REFUSAL_REASONS_GET_SUCCESS:  
      return { ...state,
        items: action.items,
        loading: false
      };
    case MTR_REFUSAL_REASONS_GET_FAILURE:
      return { ...state,
        error: action.error,
        loading: false
      };
    default:
      return state
  }
}