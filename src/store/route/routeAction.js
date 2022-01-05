import { userService } from '../../services';
import { USER_GET_REQUEST, USER_GET_SUCCESS, USER_GET_FAILURE } from '../../constants/userConstants.js'

export const userGetRequest = () => {
  return { type: USER_GET_REQUEST }
};

export const userGetSuccess = (data) => {
  return { type: USER_GET_SUCCESS, items: data.data, itemsTotal: data.meta.total}
};

export const userGetFailure = (data) => {
  return { type: USER_GET_FAILURE, error: data }
};

export const userFetch = (page, perPage) => {
  return (dispatch) => {
    dispatch(userGetRequest());
    
    userService.getAll(page, perPage).then(
        itemCollection => {
            itemCollection.data = itemCollection.data.reduce((arr, item) => {arr[item.id] = item;return arr;}, []);
            dispatch(userGetSuccess(itemCollection));
        },
        error => dispatch(userGetFailure(error))
      );
  }
}