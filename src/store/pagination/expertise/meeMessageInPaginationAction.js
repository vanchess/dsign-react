import { MEE_MESSAGE_IN_CHANGE_PER_PAGE, MEE_MESSAGE_IN_CHANGE_PAGE } from '../../../constants/expertisePaginationConstants'
import { messageFetch } from '../../expertise/meeMessageInAction.js'

export const messageChangeRowPerPage = (newPerPage) => {
    return {type: MEE_MESSAGE_IN_CHANGE_PER_PAGE, perPage: newPerPage}
}

export const messageChangePage = (newPage) => {
    return {type: MEE_MESSAGE_IN_CHANGE_PAGE, page: newPage}
}

export const messageStartChangeRowPerPage = (newPerPage) => {
    return (dispatch, getState) => {
        const state = getState();
        let currentPerPage = state.paginationReducer.expertise.mee.perPage;
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
        let currentPage = state.paginationReducer.expertise.mee.page;
        if (currentPage === newPage)
        {
            return;
        }

        dispatch(messageChangePage(newPage));

        let currentPerPage = state.paginationReducer.expertise.mee.perPage;
        dispatch(messageFetch(newPage, currentPerPage));
    }
}