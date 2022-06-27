import axios from 'axios'

const API_URL = process.env.REACT_APP_API_URL;

class UserService {


    authenticateUser(user) {
        return axios.post(`${API_URL}/authenticate-user`, user);
    }

    sendNewPassword(user) {
        return axios.post(`${API_URL}/forgot-password`, user);
    }

    createEmployee(user) {
        return axios.post(`${API_URL}/create-employee`, user);
    }

    createRefugee(refugee) {
        return axios.post(`${API_URL}/create-refugee`, refugee);
    }

    validateUserCreation(user) {
        return axios.post(`${API_URL}/validate-user-creation`, user);
    }

    getResponsibleUsers() {
        return axios.get(`${API_URL}/get-responsible-users`);
    }

    getUser(userId) {
        return axios.get(`${API_URL}/get-user/${userId}`);
    }

    changePassword(accountData) {
        return axios.post(`${API_URL}/change-password`, accountData);
    }

    sendVerificationCode(user) {
        return axios.post(`${API_URL}/send-verification-code`, user);
    }

    verifyUser(userSession) {
        return axios.post(`${API_URL}/verify-user`, userSession);
    }

    getUsers(id) {
        return axios.get(`${API_URL}/get-users/${id}`);
    }

    getUsersFiltered(id, email) {
        return axios.get(`${API_URL}/get-users-filtered/${id}/${email}`);
    }

    updateUser(user) {
        return axios.post(`${API_URL}/update-user`, user);
    }

    changeStatus(id) {
        return axios.put(`${API_URL}/change-status/${id}`);
    }
}

export default new UserService()