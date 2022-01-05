import { PERIOD_GET_REQUEST, PERIOD_GET_SUCCESS, PERIOD_GET_FAILURE } from '../../constants/periodConstants.js'

const initialState = {
  items: [],
  loading: false,
  error: false,
};

export function periodReducer(state = initialState, action) {
  switch (action.type) {
    case PERIOD_GET_REQUEST:
      return { ...state,
        loading: true
      };
    case PERIOD_GET_SUCCESS:  
      return { ...state,
        items: action.items,
        loading: false
      };
    case PERIOD_GET_FAILURE:
      return { ...state,
        error: action.error,
        loading: false
      };
    default:
      return state
  }
}