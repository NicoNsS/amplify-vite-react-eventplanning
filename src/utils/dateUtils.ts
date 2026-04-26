export const formatDate = (date: string | Date): string => {
  return new Date(date).toLocaleDateString();
};

export const formatTime = (date: string | Date): string => {
  return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export const formatDateTime = (date: string | Date): string => {
  return new Date(date).toLocaleString();
};

export const combineDateTime = (date: string | Date, time: string | Date): string => {
  const d = new Date(date);
  const t = new Date(time);
  d.setHours(t.getHours());
  d.setMinutes(t.getMinutes());
  return d.toISOString();
};
