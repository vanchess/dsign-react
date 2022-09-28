import { authHeader } from '../../_helpers';
import { apiService } from '../../services';

export class inviteService {
    
    static get(code) {
        const requestOptions = {
            method: 'GET',
            headers: authHeader(),
        };

        const url = new URL(`invite/${code}`, process.env.REACT_APP_APIURL);
        return fetch(url, requestOptions).then(apiService.handleResponse);
    }
    
}