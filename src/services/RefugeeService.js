import axios from 'axios'

const API_URL = process.env.REACT_APP_API_URL;

class RefugeeService {

    getPengingRegistrations() {
        return axios.get(`${API_URL}/get-pending-registrations`);
    }

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

    getRefugeesInShelter(shelterId) {
        return axios.get(`${API_URL}/get-refugees-in-shelter/${shelterId}`);
    }

    removeRefugeeFromShelter(refugeeId) {
        return axios.put(`${API_URL}/remove-refugee-from-shelter/${refugeeId}`);
    }

    getUsersWithoutShelter() {
        return axios.get(`${API_URL}/get-users-without-shelter`);
    }

    addRefugeeToShelter(userId, shelterId) {
        return axios.put(`${API_URL}/add-refugee-to-shelter/${userId}/${shelterId}`);
    }

    getRefugeeByUserId(userId) {
        return axios.get(`${API_URL}/get-refugee-by-user-id/${userId}`);
    }

    updateRefugee(refugee) {
        return axios.patch(`${API_URL}/update-refugee`, refugee);
    }

    changeStatus(id) {
        return axios.put(`${API_URL}/change-refugee-status/${id}`);
    }
}

export default new RefugeeService()