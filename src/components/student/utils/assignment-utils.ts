
import { ref, get, query, orderByChild, equalTo } from "firebase/database";
import { database } from "@/firebase";
import { Assignment } from "../types/assignment-types";
import { toast } from "sonner";

export const fetchStudentAssignments = async (userId: string): Promise<Assignment[]> => {
  if (!userId) {
    return [];
  }
  
  try {
    // First get the student's enrollments
    const enrollmentsRef = query(
      ref(database, 'enrollments'),
      orderByChild('student_id'),
      equalTo(userId)
    );
    
    const enrollmentSnapshot = await get(enrollmentsRef);
    if (!enrollmentSnapshot.exists()) {
      return [];
    }
    
    // Extract course IDs from enrollments
    const courseIds = [];
    enrollmentSnapshot.forEach((childSnapshot) => {
      courseIds.push(childSnapshot.val().course_id);
    });
    
    if (courseIds.length === 0) {
      return [];
    }
    
    const assignmentsData = [];
    const coursesMap = {};
    
    // Get course names for each course ID
    for (const courseId of courseIds) {
      const courseRef = ref(database, `courses/${courseId}`);
      const courseSnapshot = await get(courseRef);
      if (courseSnapshot.exists()) {
        coursesMap[courseId] = courseSnapshot.val().title;
      }
    }
    
    // Get assignments for each course
    for (const courseId of courseIds) {
      const assignmentsRef = query(
        ref(database, 'assignments'),
        orderByChild('course_id'),
        equalTo(courseId)
      );
      
      const assignmentSnapshot = await get(assignmentsRef);
      if (assignmentSnapshot.exists()) {
        assignmentSnapshot.forEach((childSnapshot) => {
          assignmentsData.push({
            id: childSnapshot.key,
            ...childSnapshot.val(),
            course_name: coursesMap[courseId] || 'Unknown Course'
          });
        });
      }
    }
    
    // Get student's submissions
    const submissionsRef = query(
      ref(database, 'submissions'),
      orderByChild('user_id'),
      equalTo(userId)
    );
    
    const submissionsSnapshot = await get(submissionsRef);
    const submissions = [];
    if (submissionsSnapshot.exists()) {
      submissionsSnapshot.forEach((childSnapshot) => {
        submissions.push({
          id: childSnapshot.key,
          ...childSnapshot.val()
        });
      });
    }
    
    // Combine assignments with submission data
    const assignmentsWithSubmissions = assignmentsData.map(assignment => {
      const submission = submissions.find(s => s.assignment_id === assignment.id);
      return {
        ...assignment,
        submitted: !!submission,
        submission: submission || null
      };
    });
    
    return assignmentsWithSubmissions;
  } catch (error) {
    console.error("Error fetching assignments:", error);
    throw error;
  }
};
