import axiosClient from './axiosClient';

const roomApi = {
  getAll: () => axiosClient.get('/rooms'),
  getById: (id) => axiosClient.get(`/rooms/${id}`),
  create: (data) => axiosClient.post('/rooms', data),
  update: (id, data) => axiosClient.put(`/rooms/${id}`, data),
  delete: (id) => axiosClient.delete(`/rooms/${id}`)
};

export default roomApi;
