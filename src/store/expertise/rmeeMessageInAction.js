import { messageService } from '../../services/index.js';
import { R_MEE_MESSAGE_IN_GET_REQUEST, R_MEE_MESSAGE_IN_GET_SUCCESS, R_MEE_MESSAGE_IN_GET_FAILURE } from '../../constants/expertiseConstants.js'

export const messageGetRequest = () => {
  return { type: R_MEE_MESSAGE_IN_GET_REQUEST }
};

export const messageGetSuccess = (data) => {
  return { type: R_MEE_MESSAGE_IN_GET_SUCCESS, items: data.data, itemsTotal: data.meta.total}
};

export const messageGetFailure = (data) => {
  return { type: R_MEE_MESSAGE_IN_GET_FAILURE, error: data }
};

export const messageFetch = (page, perPage, status = [], period = [], org = []) => {
  return (dispatch) => {
    dispatch(messageGetRequest());
    
    messageService.getAll(page, perPage, 1, ['rmee'], status, [], org).then(
        itemCollection => dispatch(messageGetSuccess(itemCollection)), 
        error => dispatch(messageGetFailure(error))
      );
  }
}