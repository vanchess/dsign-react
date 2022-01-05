import { messageStatusService } from '../../services';
import { MESSAGE_STATUS_GET_REQUEST, MESSAGE_STATUS_GET_SUCCESS, MESSAGE_STATUS_GET_FAILURE } from '../../constants/messageStatusConstants.js'

export const messageStatusGetRequest = () => {
  return { type: MESSAGE_STATUS_GET_REQUEST }
};

export const messageStatusGetSuccess = (data) => {
  return { type: MESSAGE_STATUS_GET_SUCCESS, items: data.data, itemsTotal: data.meta.total}
};

export const messageStatusGetFailure = (data) => {
  return { type: MESSAGE_STATUS_GET_FAILURE, error: data }
};

export const messageStatusFetch = (page, perPage) => {
  return (dispatch) => {
    dispatch(messageStatusGetRequest());
    
    messageStatusService.getAll(page, perPage).then(
        itemCollection => {
            itemCollection.data = itemCollection.data.reduce((arr, item) => {arr[item.id] = item;return arr;}, []);
            dispatch(messageStatusGetSuccess(itemCollection));
        }, 
        error => dispatch(messageStatusGetFailure(error))
      );
  }
}