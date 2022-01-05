import { medicalInstitutionService } from '../../services';
import { MEDICAL_INSTITUTION_GET_REQUEST, MEDICAL_INSTITUTION_GET_SUCCESS, MEDICAL_INSTITUTION_GET_FAILURE } from '../../constants/medicalInstitutionConstants.js'

export const medicalInstitutionGetRequest = () => {
  return { type: MEDICAL_INSTITUTION_GET_REQUEST }
};

export const medicalInstitutionGetSuccess = (data) => {
  return { type: MEDICAL_INSTITUTION_GET_SUCCESS, medicalInstitutions: data.data, medicalInstitutionTotal: data.meta.total}
};

export const medicalInstitutionGetFailure = (data) => {
  return { type: MEDICAL_INSTITUTION_GET_FAILURE, error: data }
};

export const medicalInstitutionFetch = (page, perPage) => {
  return (dispatch) => {
    dispatch(medicalInstitutionGetRequest());
    
    medicalInstitutionService.getAll(page, perPage).then(
        medicalInstitutionCollection => dispatch(medicalInstitutionGetSuccess(medicalInstitutionCollection)), // this.setState({employees: , employeesTotal: employees.meta.total}),
        error => dispatch(medicalInstitutionGetFailure(error))
      );
  }
}