import { REJECTED_OUT_GET_SUCCESS } from '../../../constants/billConstants.js'
import { REJECTED_OUT_CHANGE_PER_PAGE, REJECTED_OUT_CHANGE_PAGE } from '../../../constants/billPaginationConstants'

const initialState = {
    page: 0, 
    perPage: 15,
    itemsTotal: 0
};

export function rejectedOutPaginationReducer(state = initialState, action) {
  switch (action.type) {
    case REJECTED_OUT_GET_SUCCESS:
      return { ...state,
        itemsTotal: action.itemsTotal
      };
    case REJECTED_OUT_CHANGE_PER_PAGE:
      return { ...state,
        perPage: action.perPage,
        page: 0,
      };
    case REJECTED_OUT_CHANGE_PAGE:
      return { ...state,
        page: action.page,
       };
    default:
      return state
  }
}