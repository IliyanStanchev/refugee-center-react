import axios from 'axios'

const API_URL = process.env.REACT_APP_API_URL;

class DonationService {

    donateMoney(donation) {
        return axios.post(`${API_URL}/donate-money`, donation);
    }

    getDonations() {
        return axios.get(`${API_URL}/get-donations`);
    }

    saveDonation(donationData) {
        return axios.post(`${API_URL}/save-donation`, donationData);
    }

    updateDonation(donation) {
        return axios.post(`${API_URL}/update-donation`, donation);
    }

    getDonors() {
        return axios.get(`${API_URL}/get-donors`);
    }
}

export default new DonationService()