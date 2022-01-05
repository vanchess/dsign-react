import { MY_FILE_GET_SUCCESS } from '../../../constants/myFileConstants.js'
import { MY_FILE_CHANGE_PER_PAGE, MY_FILE_CHANGE_PAGE } from '../../../constants/myFilePaginationConstants'

const initialState = {
    page: 0, 
    perPage: 15,
    itemsTotal: 0
};

export function myFilePaginationReducer(state = initialState, action) {
  switch (action.type) {
    case MY_FILE_GET_SUCCESS:
      return { ...state,
        itemsTotal: action.itemsTotal
      };
    case MY_FILE_CHANGE_PER_PAGE:
      return { ...state,
        perPage: action.perPage,
        page: 0,
      };
    case MY_FILE_CHANGE_PAGE:
      return { ...state,
        page: action.page,
       };
    default:
      return state
  }
}