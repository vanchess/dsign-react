import { authHeader } from '../../_helpers';
import { apiService } from '../../services';

export class periodService {
    
    static getAll(page = 0, per_page = 20) {
        const requestOptions = {
            method: 'GET',
            headers: {...authHeader(), ...{'Accept': 'application/json'}},
        };

        const url = new URL('period', process.env.REACT_APP_APIURL);
        url.searchParams.append('page', (page + 1));
        url.searchParams.append('per_page', per_page);
        
        return fetch(url, requestOptions).then(apiService.handleResponse);
    }
    
    static get(id) {
        const requestOptions = {
            method: 'GET',
            headers: {...authHeader(), ...{'Accept': 'application/json'}},
        };

        const url = new URL(`period/${id}`, process.env.REACT_APP_APIURL);
        return fetch(url, requestOptions).then(apiService.handleResponse);
    }

}