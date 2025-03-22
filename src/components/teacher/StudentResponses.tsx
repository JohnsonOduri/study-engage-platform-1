
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { database } from "@/firebase";
import { ref, onValue, update, query, orderByChild, equalTo } from "firebase/database";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Check, MessageSquare, Filter } from "lucide-react";

interface StudentResponsesProps {
  courseId?: string;
}

export const StudentResponses: React.FC<StudentResponsesProps> = ({ courseId }) => {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user || !courseId) return;

    // Get assignments for this course
    const assignmentsRef = query(
      ref(database, 'assignments'),
      orderByChild('course_id'),
      equalTo(courseId)
    );
    
    const unsubscribe = onValue(assignmentsRef, (snapshot) => {
      if (!snapshot.exists()) {
        setSubmissions([]);
        setLoading(false);
        return;
      }
      
      // Get assignment IDs for this course
      const assignmentIds: string[] = [];
      snapshot.forEach((childSnapshot) => {
        assignmentIds.push(childSnapshot.key!);
      });
      
      if (assignmentIds.length === 0) {
        setSubmissions([]);
        setLoading(false);
        return;
      }
      
      // Now fetch submissions for these assignments
      const submissionsRef = ref(database, 'submissions');
      onValue(submissionsRef, (submissionsSnapshot) => {
        if (!submissionsSnapshot.exists()) {
          setSubmissions([]);
          setLoading(false);
          return;
        }
        
        const submissionsArray: any[] = [];
        submissionsSnapshot.forEach((childSnapshot) => {
          const submission = childSnapshot.val();
          if (assignmentIds.includes(submission.assignment_id)) {
            submissionsArray.push({
              id: childSnapshot.key,
              ...submission
            });
          }
        });
        
        setSubmissions(submissionsArray);
        setLoading(false);
      });
    });
    
    return () => unsubscribe();
  }, [user, courseId]);

  const handleGrade = async (submissionId: string, grade: number, feedback: string) => {
    try {
      const submissionRef = ref(database, `submissions/${submissionId}`);
      await update(submissionRef, {
        grade,
        feedback,
        graded_at: new Date().toISOString(),
      });
      
      toast.success("Submission graded successfully");
    } catch (error) {
      console.error("Error grading submission:", error);
      toast.error("Failed to grade submission");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Student Responses</h2>
          <p className="text-muted-foreground">Review and grade student assignment submissions</p>
        </div>
        
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filter Responses
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <p>Loading submissions...</p>
        </div>
      ) : submissions.length === 0 ? (
        <Card>
          <CardContent className="py-8">
            <div className="text-center">
              <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
              <h3 className="mt-4 text-lg font-medium">No submissions yet</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                When students submit their assignments, they will appear here.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {submissions.map((submission) => (
            <Card key={submission.id} className="overflow-hidden">
              <CardHeader className="pb-0">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{submission.assignment_title}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      Submitted by: {submission.student_name} • {new Date(submission.submitted_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant={submission.grade ? "secondary" : "outline"}>
                    {submission.grade ? "Graded" : "Pending Review"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-1">Student Response:</h4>
                    <p className="text-sm bg-muted p-3 rounded-md">{submission.content}</p>
                    
                    {submission.file_url && (
                      <div className="mt-2">
                        <a href={submission.file_url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-500 underline">
                          View Attachment
                        </a>
                      </div>
                    )}
                  </div>
                  
                  {submission.grade ? (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <h4 className="text-sm font-medium">Feedback:</h4>
                        <span className="text-sm font-medium">Grade: {submission.grade}/{submission.points}</span>
                      </div>
                      <p className="text-sm bg-muted p-3 rounded-md">{submission.feedback || "No feedback provided."}</p>
                    </div>
                  ) : (
                    <div className="flex space-x-2">
                      <Button 
                        onClick={() => handleGrade(submission.id, 0, "")} 
                        className="flex-1"
                      >
                        <Check className="h-4 w-4 mr-2" />
                        Grade Submission
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
