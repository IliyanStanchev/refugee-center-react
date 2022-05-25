import axios from 'axios'
const API_URL = process.env.REACT_APP_API_URL;

class RefugeeService {

    approvePendingRegistrations(pendingRegistrations) {
        return axios.post(`${API_URL}/approve-pending-registrations`, pendingRegistrations);
    }

    deletePendingRegistrations(pendingRegistrations) {
        return axios.post(`${API_URL}/delete-pending-registrations`, pendingRegistrations);
    }

    approvePendingRegistration(refugee) {
        return axios.post(`${API_URL}/approve-single-registration`, refugee);
    }

    deletePendingRegistration(refugee) {
        return axios.post(`${API_URL}/delete-single-registration`, refugee);
    }
}

export default new RefugeeService()