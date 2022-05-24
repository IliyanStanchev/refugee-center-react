import axios from 'axios'
const API_URL = process.env.REACT_APP_API_URL;

class DonationService {

    donateMoney(donation) {
        return axios.post(`${API_URL}/donate-money`, donation);
    }
}

export default new DonationService()