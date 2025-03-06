
export type UserRole = "student" | "teacher" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  startDate: string;
  endDate: string;
  schedule: string[];
  materials: CourseMaterial[];
}

export interface CourseMaterial {
  id: string;
  title: string;
  type: "pdf" | "video" | "link" | "document";
  url: string;
  dateAdded: string;
}

export interface AttendanceRecord {
  id: string;
  courseId: string;
  date: string;
  status: "present" | "absent" | "late";
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  recipientId: string;
  content: string;
  timestamp: string;
  read: boolean;
}
