import { authHeader } from '../_helpers';
import { apiService } from '../services';

export class fileService {

    static upload(file) {
        const formData  = new FormData();

        formData.append('file', file);
        
        const requestOptions = {
            method: 'POST',
            headers: authHeader(),
            body: formData
        };

        const url = new URL('upload-file', process.env.REACT_APP_APIURL);
        return fetch(url, requestOptions).then(apiService.handleResponse);
    }
    
    static uploadMultiple(attachment) {
        const formData  = new FormData();
        
        let len = attachment.length;
        for (let i = 0; i < len; i++) {
            formData.append('attachment[]', attachment[i]);
        }
        
        const requestOptions = {
            method: 'POST',
            headers: authHeader(),
            body: formData
        };

        const url = new URL('upload-file-multiple', process.env.REACT_APP_APIURL);
        return fetch(url, requestOptions).then(apiService.handleResponse);
    }
    
    static getFile(url) {
        const requestOptions = {
            method: 'GET',
            headers: authHeader()
        };
        
        return fetch(url, requestOptions).then(apiService.handleBlobResponse);
    }
    
    static getFileById(id) {
        const requestOptions = {
            method: 'GET',
            headers: authHeader()
        };
        
        const url = new URL(`download-file/${id}`, process.env.REACT_APP_APIURL);
        return fetch(url, requestOptions).then(apiService.handleBlobResponse);
    }
    
    static getFileStampedByIdWithFilename(id) {
        const requestOptions = {
            method: 'GET',
            headers: authHeader()
        };
        
        const url = new URL(`download-file-stamped/${id}`, process.env.REACT_APP_APIURL);
        return fetch(url, requestOptions).then(apiService.handleBlobResponseWithFilename);
    }
    
    
    static saveFileSign(file_id, sign) {
        // const formData  = new FormData();

        // formData.append('file', file);
        
        const requestOptions = {
            method: 'POST',
            headers: {...authHeader(), ...{'Content-Type': 'application/json;charset=utf-8'}},
            body: JSON.stringify(sign)
        };

        const url = new URL(`file/${file_id}/sign`, process.env.REACT_APP_APIURL);
        return fetch(url, requestOptions).then(apiService.handleResponse);
    }
    
    static getFileSign(file_id) {
        const requestOptions = {
            method: 'GET',
            headers: authHeader(),
        };

        const url = new URL(`file/${file_id}/sign`, process.env.REACT_APP_APIURL);
        return fetch(url, requestOptions).then(apiService.handleResponse);
    }
    
}