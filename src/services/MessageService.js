import axios from 'axios'
const API_URL = process.env.REACT_APP_API_URL;

class MessageService {

    getSendMessages(id) {
        return axios.get(`${API_URL}/get-send-messages/${id}`);
    }

    getReceivedMessages(id) {
        return axios.get(`${API_URL}/get-received-messages/${id}`);
    }

    getReceivers() {
        return axios.get(`${API_URL}/get-receivers`);
    }

    getMessageReceivers(messageId) {
        return axios.get(`${API_URL}/get-message-receivers/${messageId}`);
    }

    markMessagesAsRead(messages) {
        return axios.post(`${API_URL}/mark-messages-as-read`, messages);
    }

    deleteMessages(messages) {
        return axios.post(`${API_URL}/delete-messages`, messages);
    }

    sendMessage(message) {
        return axios.post(`${API_URL}/send-message`, message);
    }

    setAsSeen(messageId) {
        return axios.put(`${API_URL}/set-as-seen/${messageId}`);
    }
}

export default new MessageService()