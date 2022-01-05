import { RECONCILIATION_ACT_CHANGE_PER_PAGE, RECONCILIATION_ACT_CHANGE_PAGE } from '../../../constants/billPaginationConstants'
import { messageFetch } from '../../bill/reconciliationActAction.js'

export const messageChangeRowPerPage = (newPerPage) => {
    return {type: RECONCILIATION_ACT_CHANGE_PER_PAGE, perPage: newPerPage}
}

export const messageChangePage = (newPage) => {
    return {type: RECONCILIATION_ACT_CHANGE_PAGE, page: newPage}
}

export const messageStartChangeRowPerPage = (newPerPage) => {
    return (dispatch, getState) => {
        const state = getState();
        let currentPerPage = state.paginationReducer.bill.reconciliationAct.perPage;
        if(currentPerPage === newPerPage)
        {
            return;
        }
        dispatch(messageChangeRowPerPage(newPerPage));

        dispatch(messageFetch(0, newPerPage));

    }
}

export const messageStartChangePage = (newPage) => {
    return (dispatch, getState) => {


        const state = getState();
        let currentPage = state.paginationReducer.bill.reconciliationAct.page;
        if (currentPage === newPage)
        {
            return;
        }

        dispatch(messageChangePage(newPage));

        let currentPerPage = state.paginationReducer.bill.reconciliationAct.perPage;
        dispatch(messageFetch(newPage, currentPerPage));
    }
}