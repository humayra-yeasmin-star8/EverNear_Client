export type EventCategory =
  | "Community Volunteering"
  | "Helping Underprivileged Children"
  | "Food Distribution"
  | "Tree Plantation"
  | "Environmental Cleanup"
  | "Visiting Elderly People"
  | "Blood Donation Awareness"
  | "Community Fundraising"
  | "Educational Workshops"
  | "Mental Health Awareness & Community Support";

export interface ParticipantReflection {
  id: string;
  name: string;
  role: string;
  avatar: string;
  reflection: string;
}

export interface EventImpact {
  label: string;
  value: string | number;
}

export interface EventItem {
  _id: string;
  title: string;
  description: string;
  category: EventCategory;
  image: string;
  location: string;
  date: string; // ISO date string or formatted date
  time: string;
  status: "upcoming" | "completed";
  participantCount: number;
  expectedParticipants?: number;
  // ID of the user who created the event (set by the backend)
  creatorId?: string;
  createdAt?: string;
  // Specific fields for completed events / stories:
  aboutText?: string;
  storyText?: string;
  storyHeading?: string;
  samplePeople?: ParticipantReflection[];
  impactStats?: EventImpact[];
  gallery?: string[];
  // Specific fields for upcoming events:
  objectives?: string[];
  whatToExpect?: string[];
  whoCanJoin?: string;
}

export interface User {
  id: string;
  displayName: string;
  email: string;
  photoURL?: string;
}