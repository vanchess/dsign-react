import { messageService } from '../../services';
import { MEE_MESSAGE_IN_GET_REQUEST, MEE_MESSAGE_IN_GET_SUCCESS, MEE_MESSAGE_IN_GET_FAILURE } from '../../constants/expertiseConstants.js'

export const messageGetRequest = () => {
  return { type: MEE_MESSAGE_IN_GET_REQUEST }
};

export const messageGetSuccess = (data) => {
  return { type: MEE_MESSAGE_IN_GET_SUCCESS, items: data.data, itemsTotal: data.meta.total}
};

export const messageGetFailure = (data) => {
  return { type: MEE_MESSAGE_IN_GET_FAILURE, error: data }
};

export const messageFetch = (page, perPage) => {
  return (dispatch) => {
    dispatch(messageGetRequest());
    
    messageService.getAll(page, perPage, 1, ['mee']).then(
        itemCollection => dispatch(messageGetSuccess(itemCollection)), 
        error => dispatch(messageGetFailure(error))
      );
  }
}