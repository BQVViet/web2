import axiosClient from './axiosClient';

const cinemaApi = {
  getAll: () => axiosClient.get('/cinemas'),
  getById: (id) => axiosClient.get(`/cinemas/${id}`),
  create: (data) => axiosClient.post('/cinemas', data),
  update: (id, data) => axiosClient.put(`/cinemas/${id}`, data),
  delete: (id) => axiosClient.delete(`/cinemas/${id}`)
};

export default cinemaApi;
