import { organizationService } from '../../services';
import { ORGANIZATION_GET_REQUEST, ORGANIZATION_GET_SUCCESS, ORGANIZATION_GET_FAILURE } from '../../constants/organizationConstants.js'

export const organizationGetRequest = () => {
  return { type: ORGANIZATION_GET_REQUEST }
};

export const organizationGetSuccess = (data) => {
  return { type: ORGANIZATION_GET_SUCCESS, items: data.data, itemsTotal: data.meta.total}
};

export const organizationGetFailure = (data) => {
  return { type: ORGANIZATION_GET_FAILURE, error: data }
};

export const organizationFetch = (page, perPage) => {
  return (dispatch) => {
    dispatch(organizationGetRequest());
    
    organizationService.getAll(page, perPage).then(
        itemCollection => {
            itemCollection.data = itemCollection.data.reduce((arr, item) => {arr[item.id] = item;return arr;}, []);
            dispatch(organizationGetSuccess(itemCollection));
        }, 
        error => dispatch(organizationGetFailure(error))
      );
  }
}