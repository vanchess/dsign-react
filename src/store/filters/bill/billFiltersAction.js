import { BILL_FILTER_PERIOD_SET, BILL_FILTER_ORGANIZATION_SET, BILL_FILTER_CATEGORY_SET, BILL_FILTER_DATE_FROM_SET, BILL_FILTER_DATE_TO_SET, BILL_FILTER_STATUS_SET } from '../../../constants/billFiltersConstants'

export const billFilterPeriodSet = (value) => {
    return {type: BILL_FILTER_PERIOD_SET, value: value}
}

export const billFilterOrganizationSet = (value) => {
    return {type: BILL_FILTER_ORGANIZATION_SET, value: value}
}

export const billFilterCategorySet = (value) => {
    return {type: BILL_FILTER_CATEGORY_SET, value: value}
}

export const billFilterDateFromSet = (value) => {
    return {type: BILL_FILTER_DATE_FROM_SET, value: value}
}

export const billFilterDateToSet = (value) => {
    return {type: BILL_FILTER_DATE_TO_SET, value: value}
}

export const billFilterStatusSet = (value) => {
    return {type: BILL_FILTER_STATUS_SET, value: value}
}