import { MESSAGE_IN_CHANGE_PER_PAGE, MESSAGE_IN_CHANGE_PAGE } from '../../../constants/messagePaginationConstants'
import { messageFetch } from '../../message/messageInAction.js'

export const messageChangeRowPerPage = (newPerPage) => {
    return {type: MESSAGE_IN_CHANGE_PER_PAGE, perPage: newPerPage}
}

export const messageChangePage = (newPage) => {
    return {type: MESSAGE_IN_CHANGE_PAGE, page: newPage}
}

export const messageStartChangeRowPerPage = (newPerPage) => {
    return (dispatch, getState) => {
        const state = getState();
        let currentPerPage = state.paginationReducer.message.incoming.perPage;
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
        let currentPage = state.paginationReducer.message.incoming.page;
        if (currentPage === newPage)
        {
            return;
        }

        dispatch(messageChangePage(newPage));

        let currentPerPage = state.paginationReducer.message.incoming.perPage;
        dispatch(messageFetch(newPage, currentPerPage));
    }
}