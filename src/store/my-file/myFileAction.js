import { myFileService } from '../../services';
import { MY_FILE_GET_REQUEST, MY_FILE_GET_SUCCESS, MY_FILE_GET_FAILURE } from '../../constants/myFileConstants.js'

export const myFileGetRequest = () => {
  return { type: MY_FILE_GET_REQUEST }
};

export const myFileGetSuccess = (data) => {
  return { type: MY_FILE_GET_SUCCESS, items: data.data, itemsTotal: data.meta.total}
};

export const myFileGetFailure = (data) => {
  return { type: MY_FILE_GET_FAILURE, error: data }
};

export const myFileFetch = (page, perPage) => {
  return (dispatch) => {
    dispatch(myFileGetRequest());
    
    myFileService.getAll(page, perPage).then(
        itemCollection => dispatch(myFileGetSuccess(itemCollection)), // this.setState({employees: , employeesTotal: employees.meta.total}),
        error => dispatch(myFileGetFailure(error))
      );
  }
}