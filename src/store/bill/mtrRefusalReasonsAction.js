import { messageService } from '../../services';
import { MTR_REFUSAL_REASONS_GET_REQUEST, MTR_REFUSAL_REASONS_GET_SUCCESS, MTR_REFUSAL_REASONS_GET_FAILURE } from '../../constants/billConstants.js'

export const messageGetRequest = () => {
  return { type: MTR_REFUSAL_REASONS_GET_REQUEST }
};

export const messageGetSuccess = (data) => {
  return { type: MTR_REFUSAL_REASONS_GET_SUCCESS, items: data.data, itemsTotal: data.meta.total}
};

export const messageGetFailure = (data) => {
  return { type: MTR_REFUSAL_REASONS_GET_FAILURE, error: data }
};

export const messageFetch = (page, perPage, status = [], period = [], org = []) => {
  return (dispatch) => {
    dispatch(messageGetRequest());
    
    messageService.getAll(page, perPage, 1, ['mtr-refusal-reasons'], status, period, org).then(
        itemCollection => dispatch(messageGetSuccess(itemCollection)), 
        error => dispatch(messageGetFailure(error))
      );
  }
}