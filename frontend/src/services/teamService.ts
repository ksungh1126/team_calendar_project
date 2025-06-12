import { api } from './api';

export interface TeamData {
  name: string;
  description?: string;
  isPublic?: boolean;
}

export interface Team {
  id: number;
  name: string;
  description?: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  Users?: Array<{ id: number; username: string; TeamMember: { role: string } }>; // 팀 멤버 포함
}

export interface TeamMemberData {
  teamId: number;
  userId: number;
  role?: 'admin' | 'member';
}

export const teamService = {
  createTeam: async (teamData: TeamData) => {
    const response = await api.post<Team>('/team', teamData);
    return response.data;
  },

  getTeams: async () => {
    const response = await api.get<{ teams: Team[] }>('/team');
    return response.data;
  },

  getTeam: async (teamId: number) => {
    const response = await api.get<Team>(`/team/${teamId}`);
    return response.data;
  },

  inviteMember: async (teamId: number, userId: number) => {
    const response = await api.post(`/team/invite`, { teamId, userId });
    return response.data;
  },

  updateMemberRole: async (teamId: number, userId: number, role: 'admin' | 'member') => {
    const response = await api.put(`/team/member/role`, { teamId, userId, role });
    return response.data;
  },

  removeMember: async (teamId: number, userId: number) => {
    const response = await api.delete(`/team/member`, { data: { teamId, userId } });
    return response.data;
  },
};

export default teamService; 