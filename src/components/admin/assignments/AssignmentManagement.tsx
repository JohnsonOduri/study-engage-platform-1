
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { database } from "@/firebase";
import { ref, push, get, remove, query, orderByChild, equalTo } from "firebase/database";
import { toast } from "sonner";
import { AssignmentTabs } from "./AssignmentTabs";
import { CreateAssignmentDialog } from "./CreateAssignmentDialog";
import { AiAssignmentDialog } from "./AiAssignmentDialog";
import { GradeReports } from "./GradeReports";

export const AssignmentManagement = () => {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isAiDialogOpen, setIsAiDialogOpen] = useState(false);
  const [newAssignment, setNewAssignment] = useState({
    title: '',
    description: '',
    course_id: '',
    due_date: '',
    points: 100,
    is_ai_generated: false,
    programming_language: '',
    code_template: '',
    expected_output: '',
    assignment_type: 'written'
  });
  const [aiPrompt, setAiPrompt] = useState('');

  // Fetch assignments and courses
  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) {
        setIsLoading(false);
        return;
      }

      try {
        // For teachers, fetch courses they teach
        // For admins, fetch all courses
        const coursesRef = user.role === 'teacher' 
          ? query(ref(database, 'courses'), orderByChild('instructor_id'), equalTo(user.id))
          : ref(database, 'courses');
        
        const coursesSnapshot = await get(coursesRef);
        const coursesData = [];
        
        if (coursesSnapshot.exists()) {
          coursesSnapshot.forEach((childSnapshot) => {
            coursesData.push({
              id: childSnapshot.key,
              ...childSnapshot.val()
            });
          });
        }
        
        setCourses(coursesData);
        
        // Fetch assignments related to these courses
        const assignmentsData = [];
        for (const course of coursesData) {
          const assignmentsRef = query(
            ref(database, 'assignments'),
            orderByChild('course_id'),
            equalTo(course.id)
          );
          
          const assignmentsSnapshot = await get(assignmentsRef);
          if (assignmentsSnapshot.exists()) {
            assignmentsSnapshot.forEach((childSnapshot) => {
              assignmentsData.push({
                id: childSnapshot.key,
                ...childSnapshot.val(),
                course_title: course.title,
                course_code: course.course_code
              });
            });
          }
        }
        
        // Get submission stats for each assignment
        for (let i = 0; i < assignmentsData.length; i++) {
          const assignment = assignmentsData[i];
          const submissionsRef = query(
            ref(database, 'submissions'),
            orderByChild('assignment_id'),
            equalTo(assignment.id)
          );
          
          const submissionsSnapshot = await get(submissionsRef);
          let submissionCount = 0;
          
          if (submissionsSnapshot.exists()) {
            submissionsSnapshot.forEach(() => {
              submissionCount++;
            });
          }
          
          assignmentsData[i].submissions_count = submissionCount;
        }
        
        // Sort by created date, most recent first
        assignmentsData.sort((a, b) => {
          return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
        });
        
        setAssignments(assignmentsData);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load assignments.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user?.id, user?.role]);

  const handleCreateAssignment = async () => {
    try {
      if (!newAssignment.title || !newAssignment.course_id) {
        toast.error("Title and course are required");
        return;
      }

      // Create new assignment in Firebase
      const assignmentData = {
        ...newAssignment,
        created_at: new Date().toISOString(),
        created_by: user.id
      };

      const assignmentsRef = ref(database, 'assignments');
      await push(assignmentsRef, assignmentData);

      toast.success("Assignment created successfully");
      setIsAddDialogOpen(false);
      
      // Reset form
      setNewAssignment({
        title: '',
        description: '',
        course_id: '',
        due_date: '',
        points: 100,
        is_ai_generated: false,
        programming_language: '',
        code_template: '',
        expected_output: '',
        assignment_type: 'written'
      });
      
      // Refresh assignments list
      window.location.reload();
    } catch (error) {
      console.error("Error creating assignment:", error);
      toast.error("Failed to create assignment");
    }
  };

  const handleCreateAiAssignment = async () => {
    try {
      if (!aiPrompt || !newAssignment.course_id) {
        toast.error("Prompt and course are required");
        return;
      }

      toast.loading("Generating AI assignment...");

      // Simulate AI assignment generation
      // In a real app, you would call an API to generate the assignment
      setTimeout(() => {
        // Generate a random title and description based on the prompt
        const title = `AI Assignment: ${aiPrompt.slice(0, 20)}${aiPrompt.length > 20 ? '...' : ''}`;
        const description = `This is an AI-generated assignment based on the prompt: "${aiPrompt}". Complete the tasks according to the instructions.`;
        
        // Add code template for programming assignments
        let codeTemplate = '';
        let expectedOutput = '';
        
        if (newAssignment.assignment_type === 'programming') {
          const lang = newAssignment.programming_language;
          
          if (lang === 'java') {
            codeTemplate = `public class Solution {\n    public static void main(String[] args) {\n        // Your code here\n    }\n}`;
          } else if (lang === 'python') {
            codeTemplate = `def solution():\n    # Your code here\n    pass\n\nif __name__ == "__main__":\n    solution()`;
          } else if (lang === 'javascript') {
            codeTemplate = `function solution() {\n    // Your code here\n}\n\nsolution();`;
          } else if (lang === 'c') {
            codeTemplate = `#include <stdio.h>\n\nint main() {\n    // Your code here\n    return 0;\n}`;
          } else if (lang === 'cpp') {
            codeTemplate = `#include <iostream>\n\nint main() {\n    // Your code here\n    return 0;\n}`;
          } else if (lang === 'csharp') {
            codeTemplate = `using System;\n\npublic class Program {\n    public static void Main() {\n        // Your code here\n    }\n}`;
          }
          
          expectedOutput = "// Expected output will be shown here";
        }

        // Create the assignment with the AI-generated content
        const assignmentData = {
          title,
          description,
          course_id: newAssignment.course_id,
          due_date: newAssignment.due_date,
          points: newAssignment.points,
          is_ai_generated: true,
          programming_language: newAssignment.programming_language,
          code_template: codeTemplate,
          expected_output: expectedOutput,
          assignment_type: newAssignment.assignment_type,
          created_at: new Date().toISOString(),
          created_by: user.id,
          ai_prompt: aiPrompt
        };

        const assignmentsRef = ref(database, 'assignments');
        push(assignmentsRef, assignmentData)
          .then(() => {
            toast.dismiss();
            toast.success("AI assignment created successfully");
            setIsAiDialogOpen(false);
            
            // Reset form
            setNewAssignment({
              title: '',
              description: '',
              course_id: '',
              due_date: '',
              points: 100,
              is_ai_generated: false,
              programming_language: '',
              code_template: '',
              expected_output: '',
              assignment_type: 'written'
            });
            setAiPrompt('');
            
            // Refresh assignments list
            window.location.reload();
          })
          .catch((error) => {
            toast.dismiss();
            console.error("Error creating AI assignment:", error);
            toast.error("Failed to create AI assignment");
          });
      }, 2000);
    } catch (error) {
      toast.dismiss();
      console.error("Error creating AI assignment:", error);
      toast.error("Failed to create AI assignment");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAssignment({
      ...newAssignment,
      [name]: value
    });
  };

  const handlePointsChange = (e) => {
    const value = parseInt(e.target.value) || 0;
    setNewAssignment({
      ...newAssignment,
      points: value
    });
  };
  
  const handleSelectChange = (field, value) => {
    setNewAssignment({
      ...newAssignment,
      [field]: value
    });
  };

  const handleDeleteAssignment = async (assignmentId) => {
    if (confirm("Are you sure you want to delete this assignment?")) {
      try {
        // Delete the assignment
        await remove(ref(database, `assignments/${assignmentId}`));
        
        // Update UI
        setAssignments(assignments.filter(a => a.id !== assignmentId));
        toast.success("Assignment deleted successfully");
      } catch (error) {
        console.error("Error deleting assignment:", error);
        toast.error("Failed to delete assignment");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <h2 className="text-2xl font-bold">Assignment & Grading</h2>
        
        <div className="flex gap-2">
          <AiAssignmentDialog 
            isOpen={isAiDialogOpen}
            onOpenChange={setIsAiDialogOpen}
            courses={courses}
            newAssignment={newAssignment}
            aiPrompt={aiPrompt}
            onInputChange={handleInputChange}
            onPointsChange={handlePointsChange}
            onCourseChange={(value) => setNewAssignment({...newAssignment, course_id: value})}
            onAiPromptChange={(e) => setAiPrompt(e.target.value)}
            onSelectChange={handleSelectChange}
            onCreateAiAssignment={handleCreateAiAssignment}
          />
          
          <CreateAssignmentDialog 
            isOpen={isAddDialogOpen}
            onOpenChange={setIsAddDialogOpen}
            courses={courses}
            newAssignment={newAssignment}
            onInputChange={handleInputChange}
            onPointsChange={handlePointsChange}
            onCourseChange={(value) => setNewAssignment({...newAssignment, course_id: value})}
            onSelectChange={handleSelectChange}
            onCreateAssignment={handleCreateAssignment}
          />
        </div>
      </div>

      <AssignmentTabs 
        assignments={assignments}
        isLoading={isLoading}
        onDeleteAssignment={handleDeleteAssignment}
      />

      <GradeReports assignmentsCount={assignments.length} />
    </div>
  );
};
