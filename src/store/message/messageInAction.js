import { messageService } from '../../services';
import { MESSAGE_IN_GET_REQUEST, MESSAGE_IN_GET_SUCCESS, MESSAGE_IN_GET_FAILURE } from '../../constants/messageConstants.js'

export const messageGetRequest = () => {
  return { type: MESSAGE_IN_GET_REQUEST }
};

export const messageGetSuccess = (data) => {
  return { type: MESSAGE_IN_GET_SUCCESS, items: data.data, itemsTotal: data.meta.total}
};

export const messageGetFailure = (data) => {
  return { type: MESSAGE_IN_GET_FAILURE, error: data }
};

export const messageFetch = (page, perPage) => {
  return (dispatch) => {
    dispatch(messageGetRequest());
    
    messageService.getAll(page, perPage, 1).then(
        itemCollection => dispatch(messageGetSuccess(itemCollection)), 
        error => dispatch(messageGetFailure(error))
      );
  }
}