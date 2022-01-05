import { MESSAGE_OUT_GET_SUCCESS } from '../../../constants/messageConstants.js'
import { MESSAGE_OUT_CHANGE_PER_PAGE, MESSAGE_OUT_CHANGE_PAGE } from '../../../constants/messagePaginationConstants'

const initialState = {
    page: 0, 
    perPage: 15,
    itemsTotal: 0
};

export function messageOutPaginationReducer(state = initialState, action) {
  switch (action.type) {
    case MESSAGE_OUT_GET_SUCCESS:
      return { ...state,
        itemsTotal: action.itemsTotal
      };
    case MESSAGE_OUT_CHANGE_PER_PAGE:
      return { ...state,
        perPage: action.perPage,
        page: 0,
      };
    case MESSAGE_OUT_CHANGE_PAGE:
      return { ...state,
        page: action.page,
       };
    default:
      return state
  }
}