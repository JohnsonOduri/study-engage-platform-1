
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Plus, Check } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { ref, push, get, query, orderByChild, equalTo } from "firebase/database";
import { database } from "@/firebase";

export const JoinCourse = () => {
  const [courseCode, setCourseCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { user } = useAuth();

  const handleJoinCourse = async () => {
    if (!courseCode.trim()) {
      setError("Please enter a course code");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      // Find the course with the given course code
      const coursesRef = query(
        ref(database, 'courses'),
        orderByChild('course_code'),
        equalTo(courseCode.trim())
      );
      
      const courseSnapshot = await get(coursesRef);
      
      if (!courseSnapshot.exists()) {
        setError("Invalid course code. Please check and try again.");
        setIsLoading(false);
        return;
      }
      
      // There should be only one course with this code
      let courseId;
      let courseData;
      courseSnapshot.forEach((childSnapshot) => {
        courseId = childSnapshot.key;
        courseData = childSnapshot.val();
      });
      
      if (!courseId) {
        setError("Course not found.");
        setIsLoading(false);
        return;
      }

      // Check if user is already enrolled
      const enrollmentsRef = query(
        ref(database, 'enrollments'),
        orderByChild('user_id'),
        equalTo(user.id)
      );
      
      const enrollmentsSnapshot = await get(enrollmentsRef);
      let isAlreadyEnrolled = false;
      
      if (enrollmentsSnapshot.exists()) {
        enrollmentsSnapshot.forEach((childSnapshot) => {
          if (childSnapshot.val().course_id === courseId) {
            isAlreadyEnrolled = true;
          }
        });
      }
      
      if (isAlreadyEnrolled) {
        setError("You are already enrolled in this course.");
        setIsLoading(false);
        return;
      }
      
      // Enroll the user in the course
      const enrollmentData = {
        course_id: courseId,
        user_id: user.id,
        enrolled_at: new Date().toISOString(),
        completed: false
      };
      
      await push(ref(database, 'enrollments'), enrollmentData);
      
      setSuccess(`Successfully joined the course: ${courseData.title}`);
      toast.success("Course joined successfully!");
      setCourseCode("");
      
    } catch (error) {
      console.error("Error joining course:", error);
      setError("An error occurred while joining the course. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-xl">Join a Course</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="course-code" className="text-sm font-medium">
              Enter Course Code
            </label>
            <Input
              id="course-code"
              value={courseCode}
              onChange={(e) => setCourseCode(e.target.value)}
              placeholder="Enter the course code provided by your teacher"
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">
              This is the unique code shared by your teacher for the course.
            </p>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="bg-green-50 border-green-200 text-green-800">
              <Check className="h-4 w-4 text-green-600" />
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleJoinCourse} 
          disabled={isLoading} 
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Joining...
            </>
          ) : (
            <>
              <Plus className="mr-2 h-4 w-4" />
              Join Course
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};
