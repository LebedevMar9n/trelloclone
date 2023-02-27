import { urls } from '../constants';
import API from './axiosClient';

const sectionApi = {
  create: () => API.post(urls.section),
  getAll: () => API.get(urls.section),
  deleteOne: (sectionId) => API.delete(`${urls.section}/${sectionId}`),
  update: (sectionId, data) => API.put(`${urls.section}/${sectionId}`, data),
};

export  {sectionApi};