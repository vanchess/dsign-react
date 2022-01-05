import { authHeader } from '../../_helpers';
import { authService } from '../../services';

export class userService {

    static getAll(page = 0, per_page = 20) {
        const requestOptions = {
            method: 'GET',
            headers: authHeader(),
        };

        let url = new URL(`${process.env.REACT_APP_APIURL}/users`);
        url.searchParams.append('page', (page + 1));
        url.searchParams.append('per_page', per_page);
        return fetch(url, requestOptions).then(userService.handleResponse);
    }
    
    static handleResponse(response) {
        return response.text().then(text => {
            const data = text && JSON.parse(text);
            if (!response.ok) {
                if (response.status === 401) {
                    // auto logout if 401 response returned from api
                    authService.logout();
                    window.location.reload(true);
                }

                const error = (data && data.message) || response.statusText;
                return Promise.reject(error);
            }

            return data;
        });
    }
}