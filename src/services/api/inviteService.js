import { authHeader } from '../../_helpers';
import { apiService } from '../../services';

export class inviteService {
    
    static get(code) {
        const requestOptions = {
            method: 'GET',
            headers: authHeader(),
        };

        let url = new URL(`${process.env.REACT_APP_APIURL}/invite/${code}`);
        return fetch(url, requestOptions).then(apiService.handleResponse);
    }
    
}