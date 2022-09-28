import { authHeader } from '../../_helpers';
import { apiService } from '../../services';

export class messageStatusService {
    
    static get(id) {
        const requestOptions = {
            method: 'GET',
            headers: authHeader(),
        };

        const url = new URL(`msg-status/${id}`, process.env.REACT_APP_APIURL);
        return fetch(url, requestOptions).then(apiService.handleResponse);
    }
    
    static getAll(page = 0, per_page = 20) {
        const requestOptions = {
            method: 'GET',
            headers: authHeader(),
            //headers:{'Accept': 'application/json'}
        };

        const url = new URL('msg-status', process.env.REACT_APP_APIURL);
        url.searchParams.append('page', (page + 1));
        url.searchParams.append('per_page', per_page);
        
        return fetch(url, requestOptions).then(apiService.handleResponse);
    }

}