import { MEDICAL_INSTITUTION_CHANGE_PER_PAGE, MEDICAL_INSTITUTION_CHANGE_PAGE } from '../../../constants/medicalInstitutionPaginationConstants'
import { medicalInstitutionFetch } from '../../medical-institution/medicalInstitutionAction.js'

export const medicalInstitutionChangeRowPerPage = (newPerPage) => {
    return {type: MEDICAL_INSTITUTION_CHANGE_PER_PAGE, perPage: newPerPage}
}

export const medicalInstitutionChangePage = (newPage) => {
    return {type: MEDICAL_INSTITUTION_CHANGE_PAGE, page: newPage}
}

export const medicalInstitutionStartChangeRowPerPage = (newPerPage) => {
    return (dispatch, getState) => {
        const state = getState();
        let currentPerPage = state.paginationReducer.medicalInstitution.perPage;
        if(currentPerPage === newPerPage)
        {
            return;
        }
        dispatch(medicalInstitutionChangeRowPerPage(newPerPage));

        dispatch(medicalInstitutionFetch(0, newPerPage));

    }
}

export const medicalInstitutionStartChangePage = (newPage) => {
    return (dispatch, getState) => {


        const state = getState();
        let currentPage = state.paginationReducer.medicalInstitution.page;
        if (currentPage === newPage)
        {
            return;
        }

        dispatch(medicalInstitutionChangePage(newPage));

        let currentPerPage = state.paginationReducer.medicalInstitution.perPage;
        dispatch(medicalInstitutionFetch(newPage, currentPerPage));
    }
}