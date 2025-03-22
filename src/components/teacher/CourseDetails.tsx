
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, Copy, RefreshCw, Users, FileText, MessageSquare, CalendarCheck } from "lucide-react";
import { ref, onValue, update, push, set } from "firebase/database";
import { database } from "@/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { AssignmentUploader } from "./AssignmentUploader";
import { StudentResponses } from "./StudentResponses";
import { AttendanceTracker } from "./AttendanceTracker";
import { Badge } from "@/components/ui/badge";

interface CourseDetailsProps {
  courseId: string;
  onBack: () => void;
}

export const CourseDetails: React.FC<CourseDetailsProps> = ({ courseId, onBack }) => {
  const { user } = useAuth();
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [generatingCode, setGeneratingCode] = useState(false);

  useEffect(() => {
    if (!courseId) return;
    
    const courseRef = ref(database, `courses/${courseId}`);
    const unsubscribe = onValue(courseRef, (snapshot) => {
      if (snapshot.exists()) {
        setCourse({
          id: snapshot.key,
          ...snapshot.val()
        });
      }
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, [courseId]);

  const handleGenerateAccessCode = async () => {
    if (!user?.id || !courseId) return;
    
    setGeneratingCode(true);
    try {
      // Generate a new access code
      const newCode = generateUniqueCode();
      
      // Update the course with the new access code
      await update(ref(database, `courses/${courseId}`), {
        access_code: newCode,
        updated_at: new Date().toISOString()
      });
      
      // Create an entry in access_codes collection
      const codeRef = push(ref(database, 'access_codes'));
      await set(codeRef, {
        code: newCode,
        teacher_id: user.id,
        course_id: courseId,
        created_at: new Date().toISOString(),
        is_active: true
      });
      
      toast.success("New access code generated successfully");
    } catch (error) {
      console.error("Error generating access code:", error);
      toast.error("Failed to generate access code");
    } finally {
      setGeneratingCode(false);
    }
  };

  const copyAccessCode = () => {
    if (course?.access_code) {
      navigator.clipboard.writeText(course.access_code);
      toast.success("Access code copied to clipboard");
    }
  };

  // Function to generate a unique 6-character code
  const generateUniqueCode = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // Removed similar looking characters
    let code = "";
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  if (loading) {
    return <div>Loading course details...</div>;
  }

  if (!course) {
    return <div>Course not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={onBack}>
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Courses
        </Button>
        <h2 className="text-2xl font-bold">{course.title}</h2>
        {course.category && (
          <Badge variant="outline">{course.category}</Badge>
        )}
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Course Access</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4">
            <p className="text-sm text-muted-foreground">
              Share this access code with your students. They can use it to join this course.
            </p>
            
            <div className="flex items-center gap-2">
              <div className="bg-muted p-2 rounded font-mono flex-1">
                {course.access_code || "No access code generated yet"}
              </div>
              
              <Button
                variant="outline"
                size="icon"
                onClick={copyAccessCode}
                disabled={!course.access_code}
              >
                <Copy className="h-4 w-4" />
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleGenerateAccessCode}
                disabled={generatingCode}
              >
                <RefreshCw className={`h-4 w-4 mr-1 ${generatingCode ? 'animate-spin' : ''}`} />
                {generatingCode ? 'Generating...' : 'Generate New Code'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="assignments">
        <TabsList className="mb-4">
          <TabsTrigger value="assignments">
            <FileText className="h-4 w-4 mr-2" />
            Assignments
          </TabsTrigger>
          <TabsTrigger value="responses">
            <MessageSquare className="h-4 w-4 mr-2" />
            Student Responses
          </TabsTrigger>
          <TabsTrigger value="attendance">
            <CalendarCheck className="h-4 w-4 mr-2" />
            Attendance
          </TabsTrigger>
          <TabsTrigger value="students">
            <Users className="h-4 w-4 mr-2" />
            Enrolled Students
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="assignments">
          <AssignmentUploader courseId={course.id} />
        </TabsContent>
        
        <TabsContent value="responses">
          <StudentResponses courseId={course.id} />
        </TabsContent>
        
        <TabsContent value="attendance">
          <AttendanceTracker courseId={course.id} />
        </TabsContent>
        
        <TabsContent value="students">
          <Card>
            <CardHeader>
              <CardTitle>Enrolled Students</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Student list would be implemented here */}
              <p className="text-muted-foreground">
                Students who have enrolled using your access code will appear here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
