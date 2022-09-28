import { authHeader } from '../_helpers';
import { apiService } from '../services';

import axios from 'axios';

export class authService {
    static logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('user');
        window.location.reload(true);
    }
    
    static signUp(user)
    {
        let config = {
          headers: {
            'Content-Type': 'application/json;charset=utf-8'
          }
        }
        
        const url = new URL('auth/register', process.env.REACT_APP_APIURL);
        return axios
          .post(url, JSON.stringify(user), config)
          .then(apiService.handleAxiosResponse, apiService.handleAxiosError);
    }
    
    static login(email, password)
    {
        const url = new URL('auth/login', process.env.REACT_APP_APIURL);
        return axios
          .post(url, {
                email: email,
                password: password
            })
          .then(authService.handleResponse, authService.handleError);

    }
    
    
    static handleResponse(response) {
        // console.log(response);
        
        if (response) {
            let u = response.data.user;
            let user = {
                name: `${u.last_name} ${u.first_name[0]}. ${u.middle_name[0]}.`,
                snils: response.data.user.snils,
                //id: response.data.data.id,
                //email: response.data.data.email,
                token: response.data.access_token,
                timestamp: new Date().toString(),
                permissions: response.data.permissions
              };

            return Promise.resolve(user);
        } else {
            const error = response.statusText || "Неверный логин или пароль!";
                
            return Promise.reject(error);
        }
        
        /*
        response.text().then(text => {
            const data = text && JSON.parse(text);
            if (!response.ok) {
                if (response.status === 401) {
                    // auto logout if 401 response returned from api
                    employeesService.logout();
                    window.location.reload(true);
                }

                const error = (data && data.message) || response.statusText;
                return Promise.reject(error);
            }

            return data;
        });
        */
    }
    
    static handleError(error) {
        let msg = 'Ошибка!';
        
        //console.log(error.response.data);
        //  console.log(error.response.status);
        //console.log(error.response.headers);
        if(error.response && error.response.status == '401')
        {
            msg = error.response.statusText || "Неверный логин или пароль!";
            
        } else {
            msg = `Ошибка! ${error}`;
        }

        console.log(msg);
        return Promise.reject(msg);
    }
}