import { MY_FILE_CHANGE_PER_PAGE, MY_FILE_CHANGE_PAGE } from '../../../constants/myFilePaginationConstants'
import { myFileFetch } from '../../my-file/myFileAction.js'

export const myFileChangeRowPerPage = (newPerPage) => {
    return {type: MY_FILE_CHANGE_PER_PAGE, perPage: newPerPage}
}

export const myFileChangePage = (newPage) => {
    return {type: MY_FILE_CHANGE_PAGE, page: newPage}
}

export const myFileStartChangeRowPerPage = (newPerPage) => {
    return (dispatch, getState) => {
        const state = getState();
        let currentPerPage = state.paginationReducer.myFile.perPage;
        if(currentPerPage === newPerPage)
        {
            return;
        }
        dispatch(myFileChangeRowPerPage(newPerPage));

        dispatch(myFileFetch(0, newPerPage));

    }
}

export const myFileStartChangePage = (newPage) => {
    return (dispatch, getState) => {


        const state = getState();
        let currentPage = state.paginationReducer.myFile.page;
        if (currentPage === newPage)
        {
            return;
        }

        dispatch(myFileChangePage(newPage));

        let currentPerPage = state.paginationReducer.myFile.perPage;
        dispatch(myFileFetch(newPage, currentPerPage));
    }
}