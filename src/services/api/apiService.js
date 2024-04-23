// import { authHeader } from '../../_helpers';
import { authService } from '../../services';

export class apiService {
    
    static handleResponse(response) {
        return response.text().then(text => {
            const data = text && JSON.parse(text);
            if (!response.ok) {
               
                if (response.status === 401) {
                    // auto logout if 401 response returned from api
                    authService.logout();
                    window.location.reload(true);
                }

                const error = data || response.statusText;
                return Promise.reject(error);
            }

            return data;
        });
    }
    
    
    static handleBlobResponse(response) {
        const header = response.headers.get('Content-Disposition');
        const parts = header.split(';');
        const filename = parts[1].split('=')[1];
        // console.log(filename);
        return response.blob().then(blob => {
            if (!response.ok) {
                if (response.status === 401) {
                    // auto logout if 401 response returned from api
                    authService.logout();
                    window.location.reload(true);
                }

                const error = /*data ||*/ response.statusText;
                return Promise.reject(error);
            }
            
            return blob
        });
    }
    
    static handleBlobResponseWithFilename(response) {
        const header = response.headers.get('Content-Disposition');
        const parts = header.split(';');
        let filename = parts[1].split('=')[1];
        filename = (filename.replace(/"/g,""));
        return response.blob().then(blob => {
            if (!response.ok) {
                if (response.status === 401) {
                    // auto logout if 401 response returned from api
                    authService.logout();
                    window.location.reload(true);
                }

                const error = /*data ||*/ response.statusText;
                return Promise.reject(error);
            }
            
            return {blob: blob, filename: filename};
        });
    }
    
    static handleAxiosResponse(response) {
        // console.log('Success');
        // console.log(response);
        
        if (response) {
            return Promise.resolve(response);
        } else {
            const error = response.statusText || "Ошибка!";
                
            return Promise.reject(error);
        }
    }
    
    static handleAxiosError(error) {
        console.log('Error');
        let msg = 'Ошибка!';
        
        if (error.response && error.response.data)
        {
            msg = `Ошибка! ${error.response.data}`;
        } else {
            msg = `Ошибка! ${error.response.status} ${error.response.statusText}`;
        }
        
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
        
        return Promise.reject(msg);
    }

}