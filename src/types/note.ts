export interface Note {
  id: string;
  title: string;
  content: string;
  color: string;
  createdAt: number;
  updatedAt: number;
}

export const NOTE_COLORS = [
  '#FFD6A5', // Peach
  '#CAFFBF', // Mint
  '#9BF6FF', // Sky Blue
  '#BDB2FF', // Lavender
  '#FFC6FF', // Pink
  '#FFFFB5', // Yellow
  '#A0C4FF', // Light Blue
  '#FFADAD', // Coral
];

