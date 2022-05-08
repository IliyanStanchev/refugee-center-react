import axios from 'axios'
import env from "react-dotenv";
const API_URL = env.API_URL;

class DonationService {

    donateMoney(donation) {
        return axios.post(`${API_URL}/donate-money`, donation);
    }
}

export default new DonationService()