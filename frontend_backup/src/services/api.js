const API_BASE_URL = process.env.REACT_APP_API_URL || '';

const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || '요청 처리 중 오류가 발생했습니다.');
  }
  return data;
};

export const authService = {
  login: async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return handleResponse(response);
  },

  register: async (email, password, username) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, username }),
    });
    return handleResponse(response);
  },
};

export const eventService = {
  getEvents: async () => {
    const response = await fetch(`${API_BASE_URL}/api/events`);
    return handleResponse(response);
  },

  createEvent: async (eventData) => {
    const response = await fetch(`${API_BASE_URL}/api/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(eventData),
    });
    return handleResponse(response);
  },

  updateEvent: async (eventId, eventData) => {
    const response = await fetch(`${API_BASE_URL}/api/events/${eventId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(eventData),
    });
    return handleResponse(response);
  },

  deleteEvent: async (eventId) => {
    const response = await fetch(`${API_BASE_URL}/api/events/${eventId}`, {
      method: 'DELETE',
    });
    return handleResponse(response);
  },
};

export const teamService = {
  getTeams: async () => {
    const response = await fetch(`${API_BASE_URL}/api/teams`);
    return handleResponse(response);
  },

  getTeam: async (teamId) => {
    const response = await fetch(`${API_BASE_URL}/api/teams/${teamId}`);
    return handleResponse(response);
  },

  createTeam: async (teamData) => {
    const response = await fetch(`${API_BASE_URL}/api/teams`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(teamData),
    });
    return handleResponse(response);
  },

  deleteTeam: async (teamId) => {
    const response = await fetch(`${API_BASE_URL}/api/teams/${teamId}`, {
      method: 'DELETE',
    });
    return handleResponse(response);
  },
};

export const friendService = {
  getFriends: async () => {
    const response = await fetch(`${API_BASE_URL}/api/friends`);
    return handleResponse(response);
  },

  searchFriends: async (keyword) => {
    const response = await fetch(`${API_BASE_URL}/api/friends/search?keyword=${keyword}`);
    return handleResponse(response);
  },

  sendFriendRequest: async (friendId) => {
    const response = await fetch(`${API_BASE_URL}/api/friends/request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ friendId }),
    });
    return handleResponse(response);
  },
}; 