import { messageService } from '../../services';
import { MESSAGE_OUT_GET_REQUEST, MESSAGE_OUT_GET_SUCCESS, MESSAGE_OUT_GET_FAILURE } from '../../constants/expertiseConstants.js'

export const messageGetRequest = () => {
  return { type: MESSAGE_OUT_GET_REQUEST }
};

export const messageGetSuccess = (data) => {
  return { type: MESSAGE_OUT_GET_SUCCESS, items: data.data, itemsTotal: data.meta.total}
};

export const messageGetFailure = (data) => {
  return { type: MESSAGE_OUT_GET_FAILURE, error: data }
};

export const messageFetch = (page, perPage) => {
  return (dispatch) => {
    dispatch(messageGetRequest());
    
    messageService.getAll(page, perPage, 0, ['mek']).then(
        itemCollection => dispatch(messageGetSuccess(itemCollection)), 
        error => dispatch(messageGetFailure(error))
      );
  }
}