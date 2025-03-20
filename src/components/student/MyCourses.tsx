
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Loader2, BookOpen, Calendar, Clock, Play } from "lucide-react";
import { ref, get, query, orderByChild, equalTo } from "firebase/database";
import { database } from "@/firebase";

export const MyCourses = () => {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchEnrollments = async () => {
      if (!user?.id) {
        setIsLoading(false);
        return;
      }
      
      try {
        // Get enrollments from Firebase
        const enrollmentsRef = query(
          ref(database, 'enrollments'),
          orderByChild('user_id'),
          equalTo(user.id)
        );
        
        const snapshot = await get(enrollmentsRef);
        if (!snapshot.exists()) {
          setEnrollments([]);
          setIsLoading(false);
          return;
        }
        
        const enrollmentData = [];
        snapshot.forEach((childSnapshot) => {
          enrollmentData.push({
            id: childSnapshot.key,
            ...childSnapshot.val()
          });
        });
        
        // Fetch course details for each enrollment
        const enrollmentsWithCourses = await Promise.all(
          enrollmentData.map(async (enrollment) => {
            const courseRef = ref(database, `courses/${enrollment.course_id}`);
            const courseSnapshot = await get(courseRef);
            
            if (courseSnapshot.exists()) {
              return {
                ...enrollment,
                courses: courseSnapshot.val()
              };
            }
            return enrollment;
          })
        );
        
        setEnrollments(enrollmentsWithCourses);
      } catch (error) {
        console.error("Error fetching enrollments:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEnrollments();
  }, [user?.id]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!enrollments || enrollments.length === 0) {
    return (
      <div className="text-center py-12">
        <BookOpen className="h-12 w-12 mx-auto text-muted-foreground" />
        <h3 className="mt-4 text-lg font-medium">No Courses Found</h3>
        <p className="mt-2 text-muted-foreground">
          You are not enrolled in any courses yet.
        </p>
        <Button className="mt-4">Browse Courses</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">My Courses</h2>
        <Button>Browse More Courses</Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {enrollments.map((enrollment) => (
          <CourseCard 
            key={enrollment.id} 
            enrollment={enrollment} 
          />
        ))}
      </div>
    </div>
  );
};

const CourseCard = ({ enrollment }: { enrollment: any }) => {
  const course = enrollment.courses;
  
  // Calculate a mock progress percentage between 0-100
  const progressPercentage = enrollment.completed ? 100 : Math.floor(Math.random() * 100);
  
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="relative h-40 bg-gradient-to-r from-blue-500 to-purple-500">
          <div className="absolute inset-0 flex items-center justify-center">
            <BookOpen className="h-16 w-16 text-white opacity-25" />
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
            <Badge className="mb-2">{course.category || 'General'}</Badge>
            <h3 className="text-lg font-semibold text-white truncate">{course.title}</h3>
          </div>
        </div>
        
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Started {new Date(enrollment.enrolled_at).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">12 weeks</span>
            </div>
          </div>
          
          <div className="mt-4">
            <div className="flex justify-between mb-1 text-sm">
              <span>Progress</span>
              <span>{progressPercentage}%</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
          
          <Button className="w-full mt-4 gap-2">
            <Play className="h-4 w-4" />
            {progressPercentage === 0 ? 'Start Course' : 
             progressPercentage === 100 ? 'Review Course' : 'Continue Learning'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
