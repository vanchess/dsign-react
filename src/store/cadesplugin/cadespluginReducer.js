import { CADES_CERT_GET_REQUEST, CADES_CERT_GET_SUCCESS, CADES_CERT_GET_FAILURE, CADESPLUGIN_CHECK, CADESPLUGIN_AVAILABLE, CADESPLUGIN_NOT_AVAILABLE } from '../../constants/cadespluginConstants.js'
import { cadesCertSelectStart, cadesCertSelectCancel, cadesCertSelectOk, cadesSetSignFileIds } from './cadespluginAction.js'
import { cadesSignStart, cadesSignSuccess, cadesSignFailure } from './cadespluginAction.js'

const initialState = {
  items: [],
  loading: false,
  error: false,
  available: false,
  selected: null,
  selectionInProcess: false,
  signInProcess: false,
  signFileIds: []
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
    case cadesCertSelectStart.type:
      return { ...state,
        selectionInProcess: true
      };
    case cadesCertSelectCancel.type:
      return { ...state,
        selectionInProcess: false
      };
    case cadesCertSelectOk.type:
      return { ...state,
        selectionInProcess: false,
        selected: action.payload
      };
    case cadesSignStart.type:
      return { ...state,
        signInProcess: true
      }
    case cadesSignSuccess.type:
      return { ...state,
        signInProcess: false
      }
    case cadesSignFailure.type:
      return { ...state,
        signInProcess: false
      }
    case cadesSetSignFileIds.type:
      return { ...state,
        signFileIds: action.payload
      }
    default:
      return state
  }
}