import api from './axios';

// Stats
export const getAdminStats = () => api.get('/admin/stats');

// Students
export const getAdminStudents = () => api.get('/admin/students');
export const getAdminStudentById = (id) => api.get(`/admin/students/${id}`);

// Resources (admin)
export const getAdminResources = (params) => api.get('/admin/resources', { params });
export const createAdminResource = (data) => api.post('/admin/resources', data);
export const updateAdminResource = (id, data) => api.put(`/admin/resources/${id}`, data);
export const deleteAdminResource = (id) => api.delete(`/admin/resources/${id}`);
export const patchResourceStatus = (id, status) => api.patch(`/admin/resources/${id}/status`, { status });
