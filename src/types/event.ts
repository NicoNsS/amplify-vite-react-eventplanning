export type Visibility = 'PUBLIC' | 'PRIVATE';

export interface Event {
  id: string;
  title: string;
  description?: string;
  location?: string;
  startTime: string;   // ISO-8601 UTC
  endTime: string;     // ISO-8601 UTC
  timezone: string;
  visibility: Visibility;
  createdBy: string;
}
