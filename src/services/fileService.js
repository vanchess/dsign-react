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

        let url = new URL(`${process.env.REACT_APP_APIURL}/upload-file`);
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

        let url = new URL(`${process.env.REACT_APP_APIURL}/upload-file-multiple`);
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
        
        let url = new URL(`${process.env.REACT_APP_APIURL}/download-file/${id}`);
        return fetch(url, requestOptions).then(apiService.handleBlobResponse);
    }
    
    static getFileStampedByIdWithFilename(id) {
        const requestOptions = {
            method: 'GET',
            headers: authHeader()
        };
        
        let url = new URL(`${process.env.REACT_APP_APIURL}/download-file-stamped/${id}`);
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

        let url = new URL(`${process.env.REACT_APP_APIURL}/file/${file_id}/sign`);
        return fetch(url, requestOptions).then(apiService.handleResponse);
    }
    
    static getFileSign(file_id) {
        const requestOptions = {
            method: 'GET',
            headers: authHeader(),
        };

        let url = new URL(`${process.env.REACT_APP_APIURL}/file/${file_id}/sign`);
        return fetch(url, requestOptions).then(apiService.handleResponse);
    }
    
}