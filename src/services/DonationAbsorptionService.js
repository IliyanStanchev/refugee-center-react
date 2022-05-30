import axios from 'axios'
const API_URL = process.env.REACT_APP_API_URL;

class DonationAbsorptionService {

    getDonationAbsorptions(shelterId) {
        return axios.get(`${API_URL}/get-donation-absorptions/${shelterId}`);
    }

    getNewShelterAbsorptions(shelterId) {
        return axios.get(`${API_URL}/get-new-shelter-absorptions/${shelterId}`);
    }

    saveDonationAbsorption(donation) {
        return axios.post(`${API_URL}/save-donation-absorption`, donation);
    }
}

export default new DonationAbsorptionService()