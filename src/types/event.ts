export interface Event {
  id: string;
  title: string;
  description: string;
  date: string; // ISO date string
  time: string; // HH:MM format
  location?: string;
  category: EventCategory;
  color: string;
  reminderSet: boolean;
  createdAt: number;
}

export type EventCategory = 'work' | 'personal' | 'social' | 'health' | 'other';

export const EVENT_CATEGORIES: Record<EventCategory, { emoji: string; color: string; label: string }> = {
  work: {
    emoji: '💼',
    color: '#007AFF',
    label: 'Work',
  },
  personal: {
    emoji: '🏠',
    color: '#5856D6',
    label: 'Personal',
  },
  social: {
    emoji: '🎉',
    color: '#FF2D55',
    label: 'Social',
  },
  health: {
    emoji: '💚',
    color: '#34C759',
    label: 'Health',
  },
  other: {
    emoji: '📌',
    color: '#FF9500',
    label: 'Other',
  },
};

