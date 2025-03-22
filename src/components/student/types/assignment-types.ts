
export interface Assignment {
  id: string;
  title: string;
  description?: string;
  course_id: string;
  course_name?: string;
  due_date?: string;
  points: number;
  teacher_id: string;
  assignmentType?: string;
  textContent?: string;
  fileURL?: string;
  submitted?: boolean;
  submission?: Submission | null;
}

export interface Submission {
  id: string;
  assignment_id: string;
  user_id: string;
  student_name: string;
  content: string;
  submitted_at: string;
  teacher_id: string;
  assignment_title: string;
  points: number;
  course_id: string;
  grade?: number;
  feedback?: string;
}
