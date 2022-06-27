import axios from 'axios'

const API_URL = process.env.REACT_APP_API_URL;

class QuestionService {

    sendQuestion(question) {
        return axios.post(`${API_URL}/send-question`, question);
    }

    getQuestions() {
        return axios.get(`${API_URL}/get-questions`);
    }

    setAsReserved(id) {

        return axios.put(`${API_URL}/set-as-reserved/${id}`);
    }

    freeQuestion(id) {

        return axios.put(`${API_URL}/free-question/${id}`);
    }

    deleteSelectedQuestions(questions) {
        return axios.post(`${API_URL}/delete-selected-questions`, questions);
    }

    answerQuestion(question) {
        return axios.post(`${API_URL}/answer-question`, question);
    }
}

export default new QuestionService()