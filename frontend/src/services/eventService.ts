import { api } from './api';

export interface EventData {
  title: string;
  description?: string;
  startDate: string; // ISO 8601 string
  endDate: string; // ISO 8601 string
  allDay: boolean;
  color?: string; // 색상 추가
}

export interface Event extends EventData {
  id: number;
  userId: number;
}

export const eventService = {
  // 새 일정 생성
  createEvent: async (eventData: EventData) => {
    const response = await api.post<Event>('/event', eventData);
    return response.data;
  },

  // 사용자 일정 목록 조회
  getEvents: async () => {
    const response = await api.get<{ events: Event[] }>('/event');
    return response.data;
  },

  // 일정 수정
  updateEvent: async (eventId: number, eventData: Partial<EventData>) => {
    const response = await api.put<Event>(`/event/${eventId}`, eventData);
    return response.data;
  },

  // 일정 삭제
  deleteEvent: async (eventId: number) => {
    const response = await api.delete(`/event/${eventId}`);
    return response.data;
  },
};

export default eventService; 