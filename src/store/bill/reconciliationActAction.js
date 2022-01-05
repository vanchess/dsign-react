import { messageService } from '../../services';
import { RECONCILIATION_ACT_GET_REQUEST, RECONCILIATION_ACT_GET_SUCCESS, RECONCILIATION_ACT_GET_FAILURE } from '../../constants/billConstants.js'

export const messageGetRequest = () => {
  return { type: RECONCILIATION_ACT_GET_REQUEST }
};

export const messageGetSuccess = (data) => {
  return { type: RECONCILIATION_ACT_GET_SUCCESS, items: data.data, itemsTotal: data.meta.total}
};

export const messageGetFailure = (data) => {
  return { type: RECONCILIATION_ACT_GET_FAILURE, error: data }
};

export const messageFetch = (page, perPage, status = [], period = [], org = []) => {
  return (dispatch) => {
    dispatch(messageGetRequest());
    
    messageService.getAll(page, perPage, 1, ['reconciliation-act'], status, period, org).then(
        itemCollection => dispatch(messageGetSuccess(itemCollection)), 
        error => dispatch(messageGetFailure(error))
      );
  }
}