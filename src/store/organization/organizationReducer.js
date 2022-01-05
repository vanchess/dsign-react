import { ORGANIZATION_GET_REQUEST, ORGANIZATION_GET_SUCCESS, ORGANIZATION_GET_FAILURE } from '../../constants/organizationConstants.js'

const initialState = {
  items: [],
  loading: false,
  error: false,
};

export function organizationReducer(state = initialState, action) {
  switch (action.type) {
    case ORGANIZATION_GET_REQUEST:
      return { ...state,
        loading: true
      };
    case ORGANIZATION_GET_SUCCESS:  
      return { ...state,
        items: action.items,
        loading: false
      };
    case ORGANIZATION_GET_FAILURE:
      return { ...state,
        error: action.error,
        loading: false
      };
    default:
      return state
  }
}