import api from './axios'

export const pointsApi = {
  me: (signal) => api.get('/api/v1/points/me/', { signal }),
  grants: (params, signal) => api.get('/api/v1/points/grants/', { params, signal }),
  leaderboard: (signal) => api.get('/api/v1/points/leaderboard/', { signal }),
  manageAccounts: (params, signal) => api.get('/api/v1/manage/points/', { params, signal }),
  grant: (data) => api.post('/api/v1/manage/points/grants/', data),
}
