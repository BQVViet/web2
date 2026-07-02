import axiosClient from './axiosClient';

const movieApi = {
  getAllMovies: () => {
    return axiosClient.get('/movies');
  },
  getMovieById: (id) => {
    return axiosClient.get(`/movies/${id}`);
  }
};

export default movieApi;
