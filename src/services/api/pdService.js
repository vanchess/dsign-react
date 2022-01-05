import { authHeader } from '../../_helpers';
import { apiService } from '../../services';

export class pdService {
    
    static get(code) {
        const requestOptions = {
            method: 'GET',
            headers: authHeader(),
        };

        let url = new URL(`${process.env.REACT_APP_APIURL}/pd/${code}`);
        return fetch(url, requestOptions).then(apiService.handleResponse);
    }
    
    static update(code, data) {
        // const formData  = new FormData();

        // formData.append('file', file);
        
        const requestOptions = {
            method: 'PUT',
            headers: {...authHeader(), ...{'Content-Type': 'application/json;charset=utf-8'}},
            body: JSON.stringify(data)
        };

        let url = new URL(`${process.env.REACT_APP_APIURL}/pd/${code}`);
        return fetch(url, requestOptions).then(apiService.handleResponse);
    }

}