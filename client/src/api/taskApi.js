import { urls } from '../constants';
import API from './axiosClient';

const taskApi = {
  create: (params) => API.post(urls.task, params),
  update: (taskId, params) => API.put(`${urls.task}/${taskId}`, params),
  delete: (taskId) => API.delete(`${urls.task}/${taskId}`),
  updatePosition: (params) => API.post(`${urls.task}/updateposition`, params)
};


export { taskApi };