import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Team } from '../types/team';
import { useAuth } from './AuthContext';
import { api } from '../services/api';

interface TeamContextType {
  teams: Team[];
  selectedTeam: Team | null;
  setSelectedTeam: (team: Team | null) => void;
  createTeam: (teamData: Partial<Team>) => Promise<Team>;
  updateTeam: (id: number, teamData: Partial<Team>) => Promise<Team>;
  deleteTeam: (id: number) => Promise<void>;
}

const TeamContext = createContext<TeamContextType | undefined>(undefined);

export const TeamProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);

  useEffect(() => {
    if (user) {
      fetchTeams();
    }
  }, [user]);

  const fetchTeams = async () => {
    try {
      const response = await api.get('/team');
      setTeams(response.data);
    } catch (error) {
      console.error('팀 목록 조회 실패:', error);
    }
  };

  const createTeam = async (teamData: Partial<Team>) => {
    try {
      const response = await api.post('/team', teamData);
      setTeams(prev => [...prev, response.data]);
      return response.data;
    } catch (error) {
      console.error('팀 생성 실패:', error);
      throw error;
    }
  };

  const updateTeam = async (id: number, teamData: Partial<Team>) => {
    try {
      const response = await api.put(`/team/${id}`, teamData);
      setTeams(prev => prev.map(team => team.id === id ? response.data : team));
      return response.data;
    } catch (error) {
      console.error('팀 수정 실패:', error);
      throw error;
    }
  };

  const deleteTeam = async (id: number) => {
    try {
      await api.delete(`/team/${id}`);
      setTeams(prev => prev.filter(team => team.id !== id));
      if (selectedTeam?.id === id) {
        setSelectedTeam(null);
      }
    } catch (error) {
      console.error('팀 삭제 실패:', error);
      throw error;
    }
  };

  return (
    <TeamContext.Provider value={{
      teams,
      selectedTeam,
      setSelectedTeam,
      createTeam,
      updateTeam,
      deleteTeam
    }}>
      {children}
    </TeamContext.Provider>
  );
};

export const useTeam = () => {
  const context = useContext(TeamContext);
  if (context === undefined) {
    throw new Error('useTeam must be used within a TeamProvider');
  }
  return context;
}; 