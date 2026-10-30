import api from './axios'

export const communityApi = {
  announcements: (params, signal) => api.get('/api/v1/announcements/', { params, signal, skipAuth: true }),
  announcement: (id, signal) => api.get(`/api/v1/announcements/${id}/`, { signal, skipAuth: true }),
  overview: (signal) => api.get('/api/v1/overview/', { signal }),
  manageAnnouncements: (params, signal) => api.get('/api/v1/manage/announcements/', { params, signal }),
  createAnnouncement: (data) => api.post('/api/v1/manage/announcements/', data),
  updateAnnouncement: (id, data) => api.patch(`/api/v1/manage/announcements/${id}/`, data),
  deleteAnnouncement: (id) => api.delete(`/api/v1/manage/announcements/${id}/`),
  players: (params, signal) => api.get('/api/v1/manage/players/', { params, signal }),
  player: (id) => api.get(`/api/v1/manage/players/${id}/`),
  updatePlayer: (id, data) => api.patch(`/api/v1/manage/players/${id}/`, data),
  health: () => api.get('/api/v1/health/'),
}
