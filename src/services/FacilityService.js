import axios from 'axios'
const API_URL = process.env.REACT_APP_API_URL;

class FacilityService {

    getAllShelters() {
        return axios.get(`${API_URL}/get-all-shelters`);
    }

    getAllFacilities() {
        return axios.get(`${API_URL}/get-all-facilities`);
    }

    getSheltersForTransfer(id) {
        return axios.get(`${API_URL}/get-shelters-for-transfer/${id}`);
    }

    saveFacility(facility) {
        return axios.post(`${API_URL}/save-facility`, facility);
    }
}

export default new FacilityService()