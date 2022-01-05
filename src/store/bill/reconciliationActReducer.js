import { RECONCILIATION_ACT_GET_REQUEST, RECONCILIATION_ACT_GET_SUCCESS, RECONCILIATION_ACT_GET_FAILURE } from '../../constants/billConstants.js'

const initialState = {
  items: [],
  loading: false,
  error: false,
};

export function reconciliationActReducer(state = initialState, action) {
  switch (action.type) {
    case RECONCILIATION_ACT_GET_REQUEST:
      return { ...state,
        loading: true
      };
    case RECONCILIATION_ACT_GET_SUCCESS:  
      return { ...state,
        items: action.items,
        loading: false
      };
    case RECONCILIATION_ACT_GET_FAILURE:
      return { ...state,
        error: action.error,
        loading: false
      };
    default:
      return state
  }
}