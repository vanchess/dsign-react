import { apiService } from './apiServiceBase';

export class ferzlAccountService extends apiService {
    static getStatus() {
        return this.get('ferzl-account');
    }

    static save(report) {
        return this.post('ferzl-account', report, {
            headers: {'Content-Type': 'application/json;charset=utf-8'},
        });
    }

    static getSummary() {
        return this.get('ferzl-account/summary');
    }
}
