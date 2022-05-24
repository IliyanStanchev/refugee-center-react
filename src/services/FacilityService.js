import axios from 'axios'
const API_URL = process.env.REACT_APP_API_URL;

class FacilityService {

    getAllShelters() {
        return axios.get(`${API_URL}/get-all-shelters`);
    }
}

export default new FacilityService()