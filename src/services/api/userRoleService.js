import { apiService } from './apiServiceBase';

export class userRoleService extends apiService {

    static async assignRole(userId, roleName) {
        const path = `users/${userId}/assign-role/${roleName}`;
        
        const data = await this.post(path);
        return {};
    }

    static async removeRole(userId, roleName) {
        const path = `users/${userId}/remove-role/${roleName}`;
        
        const data = await this.post(path);
        return {};
    }
}