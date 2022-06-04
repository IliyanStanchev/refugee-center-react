import axios from 'axios'
const API_URL = process.env.REACT_APP_API_URL;

class RequestService {

    requestStocks(stockRequest) {
        return axios.post(`${API_URL}/request-stocks`, stockRequest);
    }

    requestLocationChange(locationChangeRequest) {
        return axios.post(`${API_URL}/request-location-change`, locationChangeRequest);
    }

    requestMedicalHelp(medicalHelpRequest) {
        return axios.post(`${API_URL}/request-medical-help`, medicalHelpRequest);
    }

}

export default new RequestService()