const normalizeBaseUrl = (rawBase) => {
  if (!rawBase) return null;
  return rawBase.endsWith('/') ? rawBase.slice(0, -1) : rawBase;
};

const browserApiUrl = typeof window !== 'undefined' ? window.__MELODY_API_URL__ : undefined;
const browserHost = typeof window !== 'undefined' ? window.location.hostname : '';
const isDeployedHost = browserHost && browserHost.includes('vercel.app');

const API_BASE_URL =
  normalizeBaseUrl(import.meta.env.VITE_API_URL) ||
  normalizeBaseUrl(browserApiUrl) ||
  (isDeployedHost ? 'https://melody-be-fawn.vercel.app' : 'http://localhost:4000');

const request = async (path, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const message = payload?.message || 'Có lỗi xảy ra, vui lòng thử lại.';
    throw new Error(message);
  }

  return payload;
};

export const register = (data) =>
  request('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const login = (data) =>
  request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const promoteToArtist = (userId, token) =>
  request(`/api/admin/users/${userId}/promote-to-artist`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });

export const demoteToListener = (userId, token) =>
  request(`/api/admin/users/${userId}/demote-to-listener`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });

export const listUsers = (token) =>
  request('/api/admin/users', {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });

export const deleteUserAdmin = (userId, token) =>
  request(`/api/admin/users/${userId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });

export const listSongsAdmin = (token) =>
  request('/api/admin/songs', {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });

export const deleteSongAdmin = (id, token) =>
  request(`/api/admin/songs/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });

export const listAlbumsAdmin = (token) =>
  request('/api/admin/albums', {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });

export const deleteAlbumAdmin = (id, token) =>
  request(`/api/admin/albums/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });

export const getUploadSignature = (token, payload = {}) =>
  request('/api/uploads/signature', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });

export const createSong = (data, token) =>
  request('/api/artists/songs', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });

export const listMySongs = (token) =>
  request('/api/artists/songs/me', {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });

export const createAlbum = (data, token) =>
  request('/api/artists/albums', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });

export const listMyAlbums = (token) =>
  request('/api/artists/albums/me', {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });

export const listAllAlbums = () =>
  request('/api/public/albums', {
    method: 'GET',
  });

export const listPublicSongs = () =>
  request('/api/public/songs', {
    method: 'GET',
  });

export const listPublicSongsLimited = (limit = 10) =>
  request(`/api/public/songs?limit=${encodeURIComponent(limit)}`, {
    method: 'GET',
  });

export const deleteAlbum = (id, token) =>
  request(`/api/artists/albums/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });

export const updateAlbum = (id, data, token) =>
  request(`/api/artists/albums/${id}`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });

export const addSongToAlbum = (albumId, songId, token) =>
  request(`/api/artists/albums/${albumId}/add-song?songId=${encodeURIComponent(songId)}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ songId }),
  });

export const removeSongFromAlbum = (albumId, songId, token) =>
  request(`/api/artists/albums/${albumId}/remove-song?songId=${encodeURIComponent(songId)}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ songId }),
  });

export const getArtistStats = (token) =>
  request('/api/artists/stats', {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });

export const deleteSong = (id, token) =>
  request(`/api/artists/songs/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });

export const createPlaylist = (data, token) =>
  request('/api/artists/playlists', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });

export const listMyPlaylists = (token) =>
  request('/api/artists/playlists/me', {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });

export const deletePlaylist = (id, token) =>
  request(`/api/artists/playlists/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });

// Listener - playlists (private)
export const createListenerPlaylist = (data, token) =>
  request('/api/listeners/playlists', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });

export const listListenerPlaylists = (token) =>
  request('/api/listeners/playlists', {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });

export const deleteListenerPlaylist = (id, token) =>
  request(`/api/listeners/playlists/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });

export const addSongToListenerPlaylist = (playlistId, songId, token) =>
  request(`/api/listeners/playlists/${playlistId}/add-song`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ songId }),
  });

export const removeSongFromListenerPlaylist = (playlistId, songId, token) =>
  request(`/api/listeners/playlists/${playlistId}/remove-song`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ songId }),
  });

// Favorites
export const listFavorites = (token) =>
  request('/api/listeners/favorites', {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });

export const addFavorite = (songId, token) =>
  request('/api/listeners/favorites', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ songId }),
  });

export const removeFavorite = (songId, token) =>
  request(`/api/listeners/favorites/${songId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });

export const listArtistComments = (token) =>
  request('/api/artists/comments', {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });

export const hideComment = (id, token) =>
  request(`/api/artists/comments/${id}/hide`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}` },
  });

export const listNotifications = (token) =>
  request('/api/notifications/me', {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });

export const markNotificationRead = (id, token) =>
  request(`/api/notifications/${id}/read`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });

export const listEarnings = (token, period) =>
  request(`/api/artists/earnings${period ? `?period=${encodeURIComponent(period)}` : ''}`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });

export const createPromotion = (data, token) =>
  request('/api/artists/promotions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });

export const listPromotions = (token) =>
  request('/api/artists/promotions', {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });

export const deletePromotion = (id, token) =>
  request(`/api/artists/promotions/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });

export const createSupport = (data, token) =>
  request('/api/artists/support', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });

export const listSupport = (token) =>
  request('/api/artists/support/me', {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });

export const statsListensLikes = (token) =>
  request('/api/artists/stats/listens-likes', {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });

export const apiBaseUrl = API_BASE_URL;
