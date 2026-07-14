import axiosClient from './axiosClient';

const showtimeApi = {
  getAll: () => axiosClient.get('/showtimes'),
  getById: (id) => axiosClient.get(`/showtimes/${id}`),
  getSeatMap: (id) => axiosClient.get(`/showtimes/${id}/seat-map`),
  create: (data) => axiosClient.post('/showtimes', data),
  update: (id, data) => axiosClient.put(`/showtimes/${id}`, data),
  delete: (id) => axiosClient.delete(`/showtimes/${id}`),
  bookSeat: (showtimeId, seatId) => axiosClient.post(`/showtimes/${showtimeId}/book-seat/${seatId}`),
  releaseSeat: (showtimeId, seatId) => axiosClient.post(`/showtimes/${showtimeId}/release-seat/${seatId}`)
};

export default showtimeApi;
