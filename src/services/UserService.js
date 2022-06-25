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

    verifyUser(id, authorizationToken) {

        let userSession = {
            id: id,
            authorizationToken: authorizationToken
        }

        return axios.post(`${API_URL}/verify-user`, userSession);
    }
}

export default new UserService()