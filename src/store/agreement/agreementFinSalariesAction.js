import { messageService } from '../../services';
import { AGREEMENT_FIN_SALARIES_MESSAGE_IN_GET_REQUEST, AGREEMENT_FIN_SALARIES_MESSAGE_IN_GET_SUCCESS, AGREEMENT_FIN_SALARIES_MESSAGE_IN_GET_FAILURE } from '../../constants/agreementConstants.js'

export const messageGetRequest = () => {
  return { type: AGREEMENT_FIN_SALARIES_MESSAGE_IN_GET_REQUEST }
};

export const messageGetSuccess = (data) => {
  return { type: AGREEMENT_FIN_SALARIES_MESSAGE_IN_GET_SUCCESS, items: data.data, itemsTotal: data.meta.total}
};

export const messageGetFailure = (data) => {
  return { type: AGREEMENT_FIN_SALARIES_MESSAGE_IN_GET_FAILURE, error: data }
};

export const messageFetch = (page, perPage, status = [], period = [], org = []) => {
  return (dispatch) => {
    dispatch(messageGetRequest());
    
    messageService.getAll(page, perPage, 1, ['agreement-fin-salaries'], status, period, org).then(
        itemCollection => dispatch(messageGetSuccess(itemCollection)), 
        error => dispatch(messageGetFailure(error))
      );
  }
}