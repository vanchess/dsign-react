import { apiService } from './apiServiceBase';

export class dnService extends apiService {

    static getAll() {
        const path = 'dnlist';
        
        return this.get(path).then((data) => {
            return {entities: data.data}
        });
    }

    static getEntries(id) {
        const path = `dnlist/${id}/entries`;

        return this.get(path).then((data) => {
            return {entities: data.data}
        });
    }

    static addEntry(listId, {id, first_name, middle_name, last_name, birthday, enp, snils, description, contact_info}) {
        const path = `dnlist/${listId}/entries`;

        return this.post(
            path, 
            {
                id,
                first_name,
                middle_name,
                last_name,
                birthday:birthday.toLocaleDateString('en-CA'),
                enp,
                snils,
                description,
                contact_info
            }, {headers: {'Content-Type': 'application/json;charset=utf-8'}}).then((data) => {
            return data;
        });
    }

    static updateEntry(listId, {id, first_name, middle_name, last_name, birthday, enp, snils, description, contact_info}) {
        const path = `dnlist/${listId}/entries/${id}`;
        
        return this.put(
            path, 
            {
                first_name,
                middle_name,
                last_name,
                birthday:birthday.toLocaleDateString('en-CA'),
                enp,
                snils,
                description,
                contact_info
            }, {headers: {'Content-Type': 'application/json;charset=utf-8'}}).then((data) => {
            return data;
        });
    }

    static deleteEntry(listId, id) {
        const path = `dnlist/${listId}/entries/${id}`;
        
        return this.delete(path).then((data) => {
            return data;
        });
    }
}