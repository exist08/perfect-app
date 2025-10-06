export interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  dueDate?: string;
  createdAt: number;
}

export const PRIORITY_COLORS = {
  low: '#34C759',
  medium: '#FF9500',
  high: '#FF3B30',
};

export const PRIORITY_LABELS = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
};

