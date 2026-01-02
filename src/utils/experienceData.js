import api from './api';

export const fetchExperiences = async () => {
  const response = await api.get('/experience');
  return response.data?.data || [];
};
