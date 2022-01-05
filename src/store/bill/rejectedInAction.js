import { messageService } from '../../services';
import { REJECTED_IN_GET_REQUEST, REJECTED_IN_GET_SUCCESS, REJECTED_IN_GET_FAILURE } from '../../constants/billConstants.js'

export const messageGetRequest = () => {
  return { type: REJECTED_IN_GET_REQUEST }
};

export const messageGetSuccess = (data) => {
  return { type: REJECTED_IN_GET_SUCCESS, items: data.data, itemsTotal: data.meta.total}
};

export const messageGetFailure = (data) => {
  return { type: REJECTED_IN_GET_FAILURE, error: data }
};

export const messageFetch = (page, perPage) => {
  return (dispatch) => {
    dispatch(messageGetRequest());
    
    messageService.getAll(page, perPage, 1, ['bill'], ['rejected']).then(
        itemCollection => dispatch(messageGetSuccess(itemCollection)), 
        error => dispatch(messageGetFailure(error))
      );
  }
}