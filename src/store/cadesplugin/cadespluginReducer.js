import { CADES_CERT_GET_REQUEST, CADES_CERT_GET_SUCCESS, CADES_CERT_GET_FAILURE, CADESPLUGIN_CHECK, CADESPLUGIN_AVAILABLE, CADESPLUGIN_NOT_AVAILABLE } from '../../constants/cadespluginConstants.js'

const initialState = {
  items: [],
  loading: false,
  error: false,
  available: false,
};

export function cadespluginReducer(state = initialState, action) {
  switch (action.type) {
    case CADES_CERT_GET_REQUEST:
      return { ...state,
        loading: true
      };
    case CADES_CERT_GET_SUCCESS:  
      return { ...state,
        error: false,
        items: action.items,
        loading: false
      };
    case CADES_CERT_GET_FAILURE:
      return { ...state,
        error: action.error,
        loading: false
      };
    default:
      return state
  }
}