import { RECONCILIATION_ACT_GET_SUCCESS } from '../../../constants/billConstants.js'
import { RECONCILIATION_ACT_CHANGE_PER_PAGE, RECONCILIATION_ACT_CHANGE_PAGE } from '../../../constants/billPaginationConstants'

const initialState = {
    page: 0, 
    perPage: 15,
    itemsTotal: 0
};

export function reconciliationActPaginationReducer(state = initialState, action) {
  switch (action.type) {
    case RECONCILIATION_ACT_GET_SUCCESS:
      return { ...state,
        itemsTotal: action.itemsTotal
      };
    case RECONCILIATION_ACT_CHANGE_PER_PAGE:
      return { ...state,
        perPage: action.perPage,
        page: 0,
      };
    case RECONCILIATION_ACT_CHANGE_PAGE:
      return { ...state,
        page: action.page,
       };
    default:
      return state
  }
}