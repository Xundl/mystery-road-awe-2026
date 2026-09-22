export interface CaseData {
  caseId: string;
  title: string;
  status: string;
  summary: string;
}

export interface Person {
  id: string;
  name: string;
  role: string;
  speciality: string;
  avatar: string;
  responsibilities: string[];
  statement: string;
}

export interface Location {
  id: string;
  name: string;
  description: string;
  contains: string[];
}

export interface Evidence {
  id: string;
  title: string;
  type: string;
  timestamp: string;
  summary: string;
  content: string;
  tags: string[];
  personIds: string[];
  locationIds: string[];
  status: string;
  relevance: string;
  bookmarked?: boolean;
}

export interface TimelineEvent {
  time: string;
  certainty: string;
  title: string;
  description: string;
  type: string;
  locationIds: string[];
  evidenceIds: string[];
  personIds: string[];
}