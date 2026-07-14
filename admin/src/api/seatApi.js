import axiosClient from './axiosClient';

const seatApi = {
  getAll: () => axiosClient.get('/seats'),
  getById: (id) => axiosClient.get(`/seats/${id}`),
  create: (data) => axiosClient.post('/seats', data),
  update: (id, data) => axiosClient.put(`/seats/${id}`, data),
  delete: (id) => axiosClient.delete(`/seats/${id}`),
  deleteByRoom: (roomId) => axiosClient.delete(`/seats/room/${roomId}`)
};

export default seatApi;
