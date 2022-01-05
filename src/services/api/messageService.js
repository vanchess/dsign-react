import { authHeader } from '../../_helpers';
import { apiService } from '../../services';

export class messageService {
    
    static get(id) {
        const requestOptions = {
            method: 'GET',
            headers: authHeader(),
        };

        let url = new URL(`${process.env.REACT_APP_APIURL}/msg/${id}`);
        return fetch(url, requestOptions).then(apiService.handleResponse);
    }
    
    static getAll(page = 0, per_page = 20, incoming = 0, type = [], status = [], period = [], organization = []) {
        const requestOptions = {
            method: 'GET',
            headers: authHeader(),
        };

        let url = new URL(`${process.env.REACT_APP_APIURL}/msg`);
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

        let url = new URL(`${process.env.REACT_APP_APIURL}/msg`);
        return fetch(url, requestOptions).then(apiService.handleResponse);
    }
    
    static getTo(id) {
        const requestOptions = {
            method: 'GET',
            headers: authHeader(),
        };

        let url = new URL(`${process.env.REACT_APP_APIURL}/msg/${id}/to-users`);
        return fetch(url, requestOptions).then(apiService.handleResponse);
    }
    
    static getFiles(id) {
        const requestOptions = {
            method: 'GET',
            headers: authHeader(),
        };

        let url = new URL(`${process.env.REACT_APP_APIURL}/msg/${id}/files`);
        return fetch(url, requestOptions).then(apiService.handleResponse);
    }
    
    static setStatus(msgId, statusName) {
        const requestOptions = {
            method: 'POST',
            headers: {...authHeader(), ...{'Content-Type': 'application/json;charset=utf-8'}},
            body: JSON.stringify({status: statusName})
        };

        let url = new URL(`${process.env.REACT_APP_APIURL}/msg/${msgId}/status`);
        return fetch(url, requestOptions).then(apiService.handleResponse);
    }
}