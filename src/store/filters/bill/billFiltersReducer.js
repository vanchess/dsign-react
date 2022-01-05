import { BILL_FILTER_PERIOD_SET, BILL_FILTER_ORGANIZATION_SET, BILL_FILTER_CATEGORY_SET, BILL_FILTER_DATE_FROM_SET, BILL_FILTER_DATE_TO_SET, BILL_FILTER_STATUS_SET } from '../../../constants/billFiltersConstants'

const initialState = {
    period: [], 
    organization: [],
    category: [],
    dateFrom: null,
    dateTo: null,
    status: []
};

export function billFiltersReducer(state = initialState, action) {
  switch (action.type) {
    case BILL_FILTER_PERIOD_SET:
      return { ...state,
        period: action.value
      };
    case BILL_FILTER_ORGANIZATION_SET:
      return { ...state,
        organization: action.value
      };
    case BILL_FILTER_CATEGORY_SET:
      return { ...state,
        category: action.value,
       };
    case BILL_FILTER_DATE_FROM_SET:
      return { ...state,
        dateFrom: action.value,
       };
    case BILL_FILTER_DATE_TO_SET:
      return { ...state,
        dateTo: action.value,
       };
    case BILL_FILTER_STATUS_SET:
      return { ...state,
        status: action.value,
       };
    default:
      return state
  }
}