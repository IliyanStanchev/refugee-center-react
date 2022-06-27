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

    getStockRequests(userId) {
        return axios.get(`${API_URL}/get-stock-requests/${userId}`);
    }

    getLocationChangeRequests(userId) {
        return axios.get(`${API_URL}/get-location-change-requests/${userId}`);
    }

    getMedicalHelpRequests(userId) {
        return axios.get(`${API_URL}/get-medical-help-requests/${userId}`);
    }

    declineStockRequests(requests) {
        return axios.post(`${API_URL}/decline-stock-requests`, requests);
    }

    declineLocationChangeRequests(requests) {
        return axios.post(`${API_URL}/decline-location-change-requests`, requests);
    }

    declineMedicalHelpRequests(requests) {
        return axios.post(`${API_URL}/decline-medical-help-requests`, requests);
    }

    declineStockRequest(stockRequest) {
        return axios.post(`${API_URL}/decline-stock-request`, stockRequest);
    }

    declineLocationChangeRequest(locationChangeRequest) {
        return axios.post(`${API_URL}/decline-location-change-request`, locationChangeRequest);
    }

    approveStockRequest(stockRequest) {
        return axios.post(`${API_URL}/approve-stock-request`, stockRequest);
    }

    approveLocationChangeRequest(locationChangeRequest) {
        return axios.post(`${API_URL}/approve-location-change-request`, locationChangeRequest);
    }
}

export default new RequestService()