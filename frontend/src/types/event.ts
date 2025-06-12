export interface Event {
  id: number;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  allDay: boolean;
  color: string;
  teamId?: number;
  userId?: number;
  createdAt: string;
  updatedAt: string;
} 