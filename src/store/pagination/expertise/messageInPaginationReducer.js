import { MESSAGE_IN_GET_SUCCESS } from '../../../constants/expertiseConstants.js'
import { MESSAGE_IN_CHANGE_PER_PAGE, MESSAGE_IN_CHANGE_PAGE } from '../../../constants/expertisePaginationConstants'

const initialState = {
    page: 0, 
    perPage: 15,
    itemsTotal: 0
};

export function messageInPaginationReducer(state = initialState, action) {
  switch (action.type) {
    case MESSAGE_IN_GET_SUCCESS:
      return { ...state,
        itemsTotal: action.itemsTotal
      };
    case MESSAGE_IN_CHANGE_PER_PAGE:
      return { ...state,
        perPage: action.perPage,
        page: 0,
      };
    case MESSAGE_IN_CHANGE_PAGE:
      return { ...state,
        page: action.page,
       };
    default:
      return state
  }
}