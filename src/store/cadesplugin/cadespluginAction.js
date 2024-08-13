import { cadespluginService } from '../../services';
import { CADES_CERT_GET_REQUEST, CADES_CERT_GET_SUCCESS, CADES_CERT_GET_FAILURE, CADESPLUGIN_CHECK, CADESPLUGIN_AVAILABLE, CADESPLUGIN_NOT_AVAILABLE } from '../../constants/cadespluginConstants.js'
import { createAction } from '@reduxjs/toolkit';

export const cadesCertSelectStart = createAction('CADES_CERT_SELECT_START');
export const cadesCertSelectOk = createAction('CADES_CERT_SELECT_OK');
export const cadesCertSelectCancel = createAction('CADES_CERT_SELECT_CANCEL');
export const cadesSignStart = createAction('CADES_SIGN_START');
export const cadesSignSuccess = createAction('CADES_SIGN_SUCCESS');
export const cadesSignFailure = createAction('CADES_SIGN_FAILURE');
export const cadesSetSignFileIds = createAction('SET_SIGN_FILE_IDS');

export const cadesCertGetRequest = () => {
  return { type: CADES_CERT_GET_REQUEST }
};

export const cadesCertGetSuccess = (data) => {
  return { type: CADES_CERT_GET_SUCCESS, items: data.data, itemsTotal: data.meta.total}
};

export const cadesCertGetFailure = (data) => {
  return { type: CADES_CERT_GET_FAILURE, error: data }
};

export const cadesCertFetch = (page, perPage) => {
  return (dispatch) => {
    dispatch(cadesCertGetRequest());
    
    try {
      cadesplugin.then(
        function () {
          cadespluginService.getAllCert().then(
            itemCollection => dispatch(cadesCertGetSuccess(itemCollection)), // this.setState({employees: , employeesTotal: employees.meta.total}),
            error => dispatch(cadesCertGetFailure(error))
          );
        },
        function(error) {
          dispatch(cadesCertGetFailure(`КриптоПро. При загрузке плагина произошла ошибка: ${error}`));
        }
      );
    }
    catch (e) {
        dispatch(cadesCertGetFailure(`КриптоПро. Error: ${e}`));
    }
    
  }
}