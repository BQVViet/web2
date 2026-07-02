import axiosClient from './axiosClient';

const userApi = {
  getAllUsers: () => {
    return axiosClient.get('/users');
  },
  
  deleteUser: (id) => {
    return axiosClient.delete(`/users/${id}`);
  }
};

export default userApi;
