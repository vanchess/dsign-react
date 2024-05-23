import { apiService } from './apiServiceBase';

export class preventiveMedicalMeasureService extends apiService {

    static getAll() {
        const path = 'preventive-medical-measure';
        
        return this.get(path).then((data) => {
            return {entities: data.data}
        });
    }
}