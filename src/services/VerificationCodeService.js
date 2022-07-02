import axios from 'axios'

const API_URL = process.env.REACT_APP_API_URL;

class VerificationCodeService {

    sendVerificationCode(user) {
        return axios.post(`${API_URL}/send-verification-code`, user);
    }

    verifyVerificationCode(verificationCode) {
        return axios.post(`${API_URL}/verify-verification-code`, verificationCode);
    }

    resetPasswordVerificationCode(verificationCode) {
        return axios.post(`${API_URL}/reset-password-verification`, verificationCode);
    }
}

export default new VerificationCodeService()