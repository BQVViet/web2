import axiosClient from './axiosClient';

const showtimeApi = {
  getAll: () => axiosClient.get('/showtimes'),
  getById: (id) => axiosClient.get(`/showtimes/${id}`),
  create: (data) => axiosClient.post('/showtimes', data),
  update: (id, data) => axiosClient.put(`/showtimes/${id}`, data),
  delete: (id) => axiosClient.delete(`/showtimes/${id}`)
};

export default showtimeApi;
