import { apiConnector } from '../utils/apiConnector.js'

const sendOTP = async (email, username) => {
  try {
    const url = 'users/sendOTP'
    const response = await apiConnector('POST', url, { email, username }, {}, {});
    return response;
  } catch (error) {
    return error;
  }
};

export default sendOTP;
