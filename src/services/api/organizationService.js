import { authHeader } from '../../_helpers';
import { apiService } from '../../services';

export class organizationService {
    
    static get(id) {
        const requestOptions = {
            method: 'GET',
            headers: authHeader(),
        };

        let url = new URL(`${process.env.REACT_APP_APIURL}/organization/${id}`);
        return fetch(url, requestOptions).then(apiService.handleResponse);
    }
    
    static getAll(page = 0, per_page = 20) {
        const requestOptions = {
            method: 'GET',
            headers: authHeader(),
            headers:{'Accept': 'application/json'}
        };

        let url = new URL(`${process.env.REACT_APP_APIURL}/organization`);
        url.searchParams.append('page', (page + 1));
        url.searchParams.append('per_page', per_page);
        
        return fetch(url, requestOptions).then(apiService.handleResponse);
    }
}