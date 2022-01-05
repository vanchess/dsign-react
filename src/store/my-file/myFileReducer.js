import { MY_FILE_GET_REQUEST, MY_FILE_GET_SUCCESS, MY_FILE_GET_FAILURE } from '../../constants/myFileConstants.js'

const initialState = {
  items: [],
  loading: false,
  error: false,
};

export function myFileReducer(state = initialState, action) {
  switch (action.type) {
    case MY_FILE_GET_REQUEST:
      return { ...state,
        loading: true
      };
    case MY_FILE_GET_SUCCESS:  
      return { ...state,
        items: action.items,
        loading: false
      };
    case MY_FILE_GET_FAILURE:
      return { ...state,
        error: action.error,
        loading: false
      };
    default:
      return state
  }
}