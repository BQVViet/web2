import axiosClient from './axiosClient';

export const bannerApi = {
  getActiveBanners: () => {
    return axiosClient.get('/banners/active');
  },
};
