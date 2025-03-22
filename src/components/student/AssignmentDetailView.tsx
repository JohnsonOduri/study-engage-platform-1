
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { ref, set } from "firebase/database";
import { database } from "@/firebase";

interface AssignmentDetailViewProps {
  assignment: any;
  onBack: () => void;
  onSubmit: (updatedAssignment: any) => void;
}

export const AssignmentDetailView: React.FC<AssignmentDetailViewProps> = ({
  assignment,
  onBack,
  onSubmit
}) => {
  const { user } = useAuth();
  const [submissionContent, setSubmissionContent] = useState(
    assignment.submission?.content || ""
  );
  const [submitting, setSubmitting] = useState(false);

  const handleAssignmentSubmit = async () => {
    if (!submissionContent.trim()) {
      toast.error("Please enter your answer");
      return;
    }
    
    if (!user?.id || !assignment) {
      toast.error("Something went wrong");
      return;
    }
    
    setSubmitting(true);
    
    try {
      const submissionRef = ref(database, `submissions/submission_${Date.now()}`);
      
      const submissionData = {
        assignment_id: assignment.id,
        user_id: user.id,
        student_name: user.name,
        content: submissionContent,
        submitted_at: new Date().toISOString(),
        teacher_id: assignment.teacher_id,
        assignment_title: assignment.title,
        points: assignment.points
      };
      
      await set(submissionRef, submissionData);
      
      toast.success("Assignment submitted successfully");
      
      // Update the assignment with submission data
      const updatedAssignment = {
        ...assignment,
        submitted: true,
        submission: submissionData
      };
      
      onSubmit(updatedAssignment);
    } catch (error) {
      console.error("Error submitting assignment:", error);
      toast.error("Failed to submit assignment");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold">{assignment.title}</h3>
          <Button variant="outline" onClick={onBack}>
            Back to Assignments
          </Button>
        </div>
        
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold">Description</h4>
            <p className="text-muted-foreground">
              {assignment.description || "No description provided"}
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold">Due Date</h4>
            <p className="text-muted-foreground">
              {assignment.due_date ? 
                new Date(assignment.due_date).toLocaleDateString() : 
                "No due date specified"}
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold">Points</h4>
            <p className="text-muted-foreground">{assignment.points || 0} points</p>
          </div>
          
          {assignment.submitted ? (
            <div>
              <h4 className="font-semibold">Your Submission</h4>
              <div className="mt-2 p-4 bg-muted rounded-md">
                <p>{assignment.submission.content}</p>
              </div>
              
              <p className="text-sm text-muted-foreground mt-2">
                Submitted on {new Date(assignment.submission.submitted_at).toLocaleString()}
              </p>
              
              {assignment.submission.grade !== undefined && (
                <div className="mt-4">
                  <h4 className="font-semibold">Grade</h4>
                  <p className="mt-1">
                    {assignment.submission.grade} / {assignment.points} points
                  </p>
                  
                  {assignment.submission.feedback && (
                    <div className="mt-2">
                      <h4 className="font-semibold">Feedback</h4>
                      <p className="mt-1 p-4 bg-muted rounded-md">
                        {assignment.submission.feedback}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <Label htmlFor="submission">Your Answer</Label>
                <Textarea 
                  id="submission"
                  value={submissionContent}
                  onChange={(e) => setSubmissionContent(e.target.value)}
                  placeholder="Type your answer here..."
                  className="mt-2"
                  rows={6}
                />
              </div>
              
              <Button 
                onClick={handleAssignmentSubmit}
                disabled={submitting || !submissionContent.trim()}
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Assignment'
                )}
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
