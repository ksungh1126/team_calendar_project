import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Event } from '../types/event';
import { useAuth } from './AuthContext';
import { api } from '../services/api';

interface EventContextType {
  events: Event[];
  createEvent: (eventData: Partial<Event>) => Promise<Event>;
  updateEvent: (id: number, eventData: Partial<Event>) => Promise<Event>;
  deleteEvent: (id: number) => Promise<void>;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export const EventProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    if (user) {
      fetchEvents();
    }
  }, [user]);

  const fetchEvents = async () => {
    try {
      const response = await api.get('/event');
      setEvents(response.data);
    } catch (error) {
      console.error('일정 목록 조회 실패:', error);
    }
  };

  const createEvent = async (eventData: Partial<Event>) => {
    try {
      const response = await api.post('/event', eventData);
      setEvents(prev => [...prev, response.data]);
      return response.data;
    } catch (error) {
      console.error('일정 생성 실패:', error);
      throw error;
    }
  };

  const updateEvent = async (id: number, eventData: Partial<Event>) => {
    try {
      const response = await api.put(`/event/${id}`, eventData);
      setEvents(prev => prev.map(event => event.id === id ? response.data : event));
      return response.data;
    } catch (error) {
      console.error('일정 수정 실패:', error);
      throw error;
    }
  };

  const deleteEvent = async (id: number) => {
    try {
      await api.delete(`/event/${id}`);
      setEvents(prev => prev.filter(event => event.id !== id));
    } catch (error) {
      console.error('일정 삭제 실패:', error);
      throw error;
    }
  };

  return (
    <EventContext.Provider value={{
      events,
      createEvent,
      updateEvent,
      deleteEvent
    }}>
      {children}
    </EventContext.Provider>
  );
};

export const useEvent = () => {
  const context = useContext(EventContext);
  if (context === undefined) {
    throw new Error('useEvent must be used within an EventProvider');
  }
  return context;
}; 