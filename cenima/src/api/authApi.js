import axiosClient from './axiosClient';

const authApi = {
  login: (data) => {
    return axiosClient.post('/auth/login', data);
  },
  register: (data) => {
    return axiosClient.post('/auth/register', data);
  },
  getProfile: () => {
    return axiosClient.get('/users/profile');
  },
  updateProfile: (data) => {
    return axiosClient.put('/users/profile', data);
  },
  changePassword: (data) => {
    return axiosClient.put('/users/password', data);
  }
};

export default authApi;
