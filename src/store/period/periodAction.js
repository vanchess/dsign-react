import { periodService } from '../../services';
import { PERIOD_GET_REQUEST, PERIOD_GET_SUCCESS, PERIOD_GET_FAILURE } from '../../constants/periodConstants.js'

export const periodGetRequest = () => {
  return { type: PERIOD_GET_REQUEST }
};

export const periodGetSuccess = (data) => {
  return { type: PERIOD_GET_SUCCESS, items: data.data, itemsTotal: data.meta.total}
};

export const periodGetFailure = (data) => {
  return { type: PERIOD_GET_FAILURE, error: data }
};

export const periodFetch = (page, perPage) => {
  return (dispatch) => {
    dispatch(periodGetRequest());
    
    periodService.getAll(page, perPage).then(
        itemCollection => {
            itemCollection.data = itemCollection.data.reduce((arr, item) => {arr[item.id] = item;return arr;}, []);
            dispatch(periodGetSuccess(itemCollection));
        }, 
        error => dispatch(periodGetFailure(error))
      );
  }
}