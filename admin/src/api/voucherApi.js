import axiosClient from './axiosClient';

const voucherApi = {
  getAll: () => axiosClient.get('/vouchers'),
  getById: (id) => axiosClient.get(`/vouchers/${id}`),
  create: (data) => axiosClient.post('/vouchers', data),
  update: (id, data) => axiosClient.put(`/vouchers/${id}`, data),
  delete: (id) => axiosClient.delete(`/vouchers/${id}`)
};

export default voucherApi;
