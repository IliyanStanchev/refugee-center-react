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

    retrieveAllUsers() {
        //console.log('executed service')
        return axios.get(`${API_URL}/users`);
    }

    retrieveAdmin() {
        return axios.post(`${API_URL}/admin/profile`)
    }

    retrieveUser(id) {
        //console.log('executed service')
        return axios.get(`${API_URL}/users/${id}`);
    }

    deleteUser(id) {
        //console.log('executed service')
        return axios.delete(`${API_URL}/users/${id}`);
    }

    updateUser(id, user) {
        //console.log('executed service')
        return axios.put(`${API_URL}/users/${id}`, user);
    }

    createUser(user) {
        //console.log('executed service')
        return axios.post(`${API_URL}/login`, user);
    }
}

export default new UserService()