import { REJECTED_IN_GET_REQUEST, REJECTED_IN_GET_SUCCESS, REJECTED_IN_GET_FAILURE } from '../../constants/registerConstants.js'

const initialState = {
  items: [],
  loading: false,
  error: false,
};

export function rejectedInReducer(state = initialState, action) {
  switch (action.type) {
    case REJECTED_IN_GET_REQUEST:
      return { ...state,
        loading: true
      };
    case REJECTED_IN_GET_SUCCESS:  
      return { ...state,
        items: action.items,
        loading: false
      };
    case REJECTED_IN_GET_FAILURE:
      return { ...state,
        error: action.error,
        loading: false
      };
    default:
      return state
  }
}