import { authHeader } from '../../_helpers';
import { apiService } from '../../services';

export class messageService {
    
    static get(id) {
        const requestOptions = {
            method: 'GET',
            headers: authHeader(),
        };

        const url = new URL(`msg/${id}`, process.env.REACT_APP_APIURL);
        return fetch(url, requestOptions).then(apiService.handleResponse);
    }
    
    static getAll(page = 0, per_page = 20, incoming = 0, type = [], status = [], period = [], organization = []) {
        const requestOptions = {
            method: 'GET',
            headers: authHeader(),
        };

        const url = new URL('msg', process.env.REACT_APP_APIURL);
        url.searchParams.append('page', (page + 1));
        url.searchParams.append('per_page', per_page);
        url.searchParams.append('in', incoming);
        
        for (let t of type) {
          url.searchParams.append('type[]', t);
        }
        for (let s of status) {
          url.searchParams.append('status[]', s);
        }
        for (let p of period) {
          url.searchParams.append('period[]', p);
        }
        for (let o of organization) {
          url.searchParams.append('org[]', o);
        }
        return fetch(url, requestOptions).then(apiService.handleResponse);
    }
    
    static sendMsg(msg) {
        // const formData  = new FormData();

        // formData.append('file', file);
        
        const requestOptions = {
            method: 'POST',
            headers: {...authHeader(), ...{'Content-Type': 'application/json;charset=utf-8'}},
            body: JSON.stringify(msg)
        };

        const url = new URL('msg', process.env.REACT_APP_APIURL);
        return fetch(url, requestOptions).then(apiService.handleResponse);
    }
    
    static getTo(id) {
        const requestOptions = {
            method: 'GET',
            headers: authHeader(),
        };

        const url = new URL(`msg/${id}/to-users`, process.env.REACT_APP_APIURL);
        return fetch(url, requestOptions).then(apiService.handleResponse);
    }
    
    static getFiles(id) {
        const requestOptions = {
            method: 'GET',
            headers: authHeader(),
        };

        const url = new URL(`msg/${id}/files`, process.env.REACT_APP_APIURL);
        return fetch(url, requestOptions).then(apiService.handleResponse);
    }

    static getDispLists(id) {
        const requestOptions = {
            method: 'GET',
            headers: authHeader(),
        };

        const url = new URL(`msg/${id}/displists`, process.env.REACT_APP_APIURL);
        return fetch(url, requestOptions).then(apiService.handleResponse);
    }

    static getDnLists(id) {
        const requestOptions = {
            method: 'GET',
            headers: authHeader(),
        };

        const url = new URL(`msg/${id}/dnlists`, process.env.REACT_APP_APIURL);
        return fetch(url, requestOptions).then(apiService.handleResponse);
    }
    
    static setStatus(msgId, statusName) {
        const requestOptions = {
            method: 'POST',
            headers: {...authHeader(), ...{'Content-Type': 'application/json;charset=utf-8'}},
            body: JSON.stringify({status: statusName})
        };

        const url = new URL(`msg/${msgId}/status`, process.env.REACT_APP_APIURL);
        return fetch(url, requestOptions).then(apiService.handleResponse);
    }
}