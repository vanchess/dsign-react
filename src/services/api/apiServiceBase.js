import { authHeader } from '../../_helpers';
import { authService } from '../../services';

export class apiService {
    
    static baseUrl = `${process.env.REACT_APP_APIURL}`;
    
    static createHeaders(headers){
        return {...authHeader(), ...headers};
    }
    
    static get(path, config = {}) {
        const requestOptions = {
            method: 'GET',
            headers: this.createHeaders(config.headers),
            signal: config.signal,
        };

        let url = new URL(path, this.baseUrl);
        if  (config.params) {
            for (const [key, value] of Object.entries(config.params)) {
                if( Array.isArray(value) ) {
                    for (let v of value) {
                      url.searchParams.append(key + '[]', v);
                    }
                } else {
                    url.searchParams.append(key, value);
                }
            }
        }
        
        return fetch(url, requestOptions).then(this.handleResponse, this.handleReject);
    }
    
    static post(path, data = {}, config = {}) {
        const requestOptions = {
            method: 'POST',
            headers: this.createHeaders(config.headers),
            body: JSON.stringify(data)
        };
        //console.log(requestOptions);
        
        let url = new URL(path, this.baseUrl);
        return fetch(url, requestOptions).then(this.handleResponse);
    }

    static put(path, data = {}, config = {}) {
        const requestOptions = {
            method: 'PUT',
            headers: this.createHeaders(config.headers),
            body: JSON.stringify(data)
        };

        let url = new URL(path, this.baseUrl);
        return fetch(url, requestOptions).then(this.handleResponse);
    }

    static delete(path, config = {}) {
        const requestOptions = {
            method: 'DELETE',
            headers: this.createHeaders(config.headers),
            signal: config.signal,
        };

        let url = new URL(path, this.baseUrl);
        if  (config.params) {
            for (const [key, value] of Object.entries(config.params)) {
                if( Array.isArray(value) ) {
                    for (let v of value) {
                      url.searchParams.append(key + '[]', v);
                    }
                } else {
                    url.searchParams.append(key, value);
                }
            }
        }
        
        return fetch(url, requestOptions).then(this.handleResponse, this.handleReject);
    }
    
    static handleResponse(response) {
        return response.text().then(text => {
            const data = text && JSON.parse(text);
            //console.log(response);
            if (!response.ok) {
                if (response.status === 401) {
                    // auto logout if 401 response returned from api
                    authService.logout();
                    window.location.reload(true);
                }
                let err = {
                    data: data,
                    status: response.status,
                    statusText: response.statusText
                };
                return Promise.reject({error: err});
            }

            return data;
        });
    }

    static handleReject(error) {
        let err = {
            data: {error: error.message},
        };
        return Promise.reject({error: err});
    }
    
    /*
    static handleBlobResponse(response) {
        return response.blob().then(blob => {
            if (!response.ok) {
                if (response.status === 401) {
                    // auto logout if 401 response returned from api
                    authService.logout();
                    window.location.reload(true);
                }

                const error = /*data ||*//* response.statusText;
                return Promise.reject(error);
            }
            
            return blob
        });
    }*/
}