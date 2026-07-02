import axiosClient from './axiosClient';

const movieApi = {
  getAll: () => axiosClient.get('/movies'),
  getById: (id) => axiosClient.get(`/movies/${id}`),
  create: (data) => axiosClient.post('/movies', data),
  update: (id, data) => axiosClient.put(`/movies/${id}`, data),
  delete: (id) => axiosClient.delete(`/movies/${id}`)
};

export default movieApi;
