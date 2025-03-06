
export type UserRole = "student" | "teacher" | "admin" | "moderator";

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
  instructor_id: string;
  instructor?: string;
  category?: string;
  prerequisites?: string[];
  startDate?: string;
  endDate?: string;
  schedule?: string[];
  materials?: CourseMaterial[];
  is_archived: boolean;
  created_at: string;
  updated_at: string;
}

export interface CourseMaterial {
  id: string;
  course_id: string;
  title: string;
  type: "pdf" | "video" | "link" | "document";
  content?: string;
  file_url?: string;
  created_at: string;
  updated_at: string;
  publish_date?: string;
  deadline?: string;
}

export interface Enrollment {
  id: string;
  course_id: string;
  user_id: string;
  enrolled_at: string;
  completed: boolean;
  completion_date?: string;
}

export interface Assignment {
  id: string;
  course_id: string;
  title: string;
  description?: string;
  due_date?: string;
  points: number;
  created_at: string;
}

export interface Submission {
  id: string;
  assignment_id: string;
  user_id: string;
  content?: string;
  file_url?: string;
  submitted_at: string;
  grade?: number;
  feedback?: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  content?: string;
  created_at: string;
  read: boolean;
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
