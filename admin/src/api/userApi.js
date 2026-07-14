import axiosClient from './axiosClient';

const userApi = {
  getAllUsers: () => {
    return axiosClient.get('/users');
  },

  getById: (id) => {
    return axiosClient.get(`/users/${id}`);
  },
  
  deleteUser: (id) => {
    return axiosClient.delete(`/users/${id}`);
  },

  updateRole: (id, role) => {
    return axiosClient.put(`/users/${id}/role`, { role });
  },

  toggleStatus: (id, active) => {
    return axiosClient.put(`/users/${id}/status`, { active });
  },

  createUser: (data) => {
    return axiosClient.post('/users', data);
  },

  updateUser: (id, data) => {
    return axiosClient.put(`/users/${id}`, data);
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

export default userApi;
