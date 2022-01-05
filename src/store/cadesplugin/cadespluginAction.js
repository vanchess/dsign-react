import { cadespluginService } from '../../services';
import { CADES_CERT_GET_REQUEST, CADES_CERT_GET_SUCCESS, CADES_CERT_GET_FAILURE, CADESPLUGIN_CHECK, CADESPLUGIN_AVAILABLE, CADESPLUGIN_NOT_AVAILABLE } from '../../constants/cadespluginConstants.js'

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

