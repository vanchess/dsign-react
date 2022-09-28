import { authHeader } from '../../_helpers';
import { apiService } from '../../services';

export class pdService {
    
    static get(code) {
        const requestOptions = {
            method: 'GET',
            headers: authHeader(),
        };

        const url = new URL(`pd/${code}`, process.env.REACT_APP_APIURL);
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

        const url = new URL(`pd/${code}`, process.env.REACT_APP_APIURL);
        return fetch(url, requestOptions).then(apiService.handleResponse);
    }

}