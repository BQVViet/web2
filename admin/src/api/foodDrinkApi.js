import axiosClient from './axiosClient';

const foodDrinkApi = {
  getAll: () => axiosClient.get('/food-drinks'),
  getById: (id) => axiosClient.get(`/food-drinks/${id}`),
  create: (data) => axiosClient.post('/food-drinks', data),
  update: (id, data) => axiosClient.put(`/food-drinks/${id}`, data),
  delete: (id) => axiosClient.delete(`/food-drinks/${id}`)
};

export default foodDrinkApi;
