import axios from 'axios'

const API_URL = process.env.REACT_APP_API_URL;

class GroupService {

    getAllGroups() {
        return axios.get(`${API_URL}/get-all-groups`);
    }

    getGroupUsers(id) {
        return axios.get(`${API_URL}/get-group-users/${id}`);
    }

    getUsersForAdding(group) {
        return axios.post(`${API_URL}/get-users-for-adding`, group);
    }

    addUserToGroup(userGroup) {
        return axios.post(`${API_URL}/add-user-to-group`, userGroup);
    }

    removeUserFromGroup(userGroup) {
        return axios.post(`${API_URL}/remove-user-from-group`, userGroup);
    }

    createGroup(group) {
        return axios.post(`${API_URL}/create-group`, group);
    }

    deleteGroup(id) {
        return axios.delete(`${API_URL}/delete-group/${id}`);
    }
}

export default new GroupService()