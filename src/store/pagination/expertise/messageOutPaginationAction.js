import { MESSAGE_OUT_CHANGE_PER_PAGE, MESSAGE_OUT_CHANGE_PAGE } from '../../../constants/expertisePaginationConstants'
import { messageFetch } from '../../expertise/messageOutAction.js'

export const messageChangeRowPerPage = (newPerPage) => {
    return {type: MESSAGE_OUT_CHANGE_PER_PAGE, perPage: newPerPage}
}

export const messageChangePage = (newPage) => {
    return {type: MESSAGE_OUT_CHANGE_PAGE, page: newPage}
}

export const messageStartChangeRowPerPage = (newPerPage) => {
    return (dispatch, getState) => {
        const state = getState();
        let currentPerPage = state.paginationReducer.expertise.outgoing.perPage;
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
        let currentPage = state.paginationReducer.expertise.outgoing.page;
        if (currentPage === newPage)
        {
            return;
        }

        dispatch(messageChangePage(newPage));

        let currentPerPage = state.paginationReducer.expertise.outgoing.perPage;
        dispatch(messageFetch(newPage, currentPerPage));
    }
}