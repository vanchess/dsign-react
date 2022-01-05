import { MEE_MESSAGE_IN_GET_SUCCESS } from '../../../constants/expertiseConstants.js'
import { MEE_MESSAGE_IN_CHANGE_PER_PAGE, MEE_MESSAGE_IN_CHANGE_PAGE } from '../../../constants/expertisePaginationConstants'

const initialState = {
    page: 0, 
    perPage: 15,
    itemsTotal: 0
};

export function meeMessageInPaginationReducer(state = initialState, action) {
  switch (action.type) {
    case MEE_MESSAGE_IN_GET_SUCCESS:
      return { ...state,
        itemsTotal: action.itemsTotal
      };
    case MEE_MESSAGE_IN_CHANGE_PER_PAGE:
      return { ...state,
        perPage: action.perPage,
        page: 0,
      };
    case MEE_MESSAGE_IN_CHANGE_PAGE:
      return { ...state,
        page: action.page,
       };
    default:
      return state
  }
}