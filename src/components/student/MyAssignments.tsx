
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Loader2, FileText, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { ref, get, query, orderByChild, equalTo } from "firebase/database";
import { database } from "@/firebase";

export const MyAssignments = () => {
  const { user } = useAuth();
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [assignments, setAssignments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchAssignments = async () => {
      if (!user?.id) {
        setIsLoading(false);
        return;
      }
      
      try {
        // First get enrollments to find the courses the student is enrolled in
        const enrollmentsRef = query(
          ref(database, 'enrollments'),
          orderByChild('user_id'),
          equalTo(user.id)
        );
        
        const enrollmentSnapshot = await get(enrollmentsRef);
        if (!enrollmentSnapshot.exists()) {
          setAssignments([]);
          setIsLoading(false);
          return;
        }
        
        const courseIds = [];
        enrollmentSnapshot.forEach((childSnapshot) => {
          courseIds.push(childSnapshot.val().course_id);
        });
        
        // Get all assignments for these courses
        const assignmentsData = [];
        for (const courseId of courseIds) {
          const assignmentsRef = query(
            ref(database, 'assignments'),
            orderByChild('course_id'),
            equalTo(courseId)
          );
          
          const assignmentSnapshot = await get(assignmentsRef);
          if (assignmentSnapshot.exists()) {
            assignmentSnapshot.forEach((childSnapshot) => {
              // Get course details
              const courseRef = ref(database, `courses/${courseId}`);
              get(courseRef).then((courseSnapshot) => {
                if (courseSnapshot.exists()) {
                  assignmentsData.push({
                    id: childSnapshot.key,
                    ...childSnapshot.val(),
                    course_name: courseSnapshot.val().title
                  });
                }
              });
            });
          }
        }
        
        // Get submissions for the user
        const submissionsRef = query(
          ref(database, 'submissions'),
          orderByChild('user_id'),
          equalTo(user.id)
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
        
        // Combine assignments with submission status
        const assignmentsWithSubmissions = assignmentsData.map(assignment => {
          const submission = submissions.find(s => s.assignment_id === assignment.id);
          return {
            ...assignment,
            submitted: !!submission,
            submission: submission || null
          };
        });
        
        setAssignments(assignmentsWithSubmissions);
      } catch (error) {
        console.error("Error fetching assignments:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAssignments();
  }, [user?.id]);

  const filteredAssignments = assignments?.filter(assignment => {
    if (filter === 'all') return true;
    if (filter === 'pending') return !assignment.submitted;
    if (filter === 'completed') return assignment.submitted;
    return true;
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">My Assignments</h2>
        <Tabs value={filter} onValueChange={(value) => setFilter(value as any)} className="w-auto">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {(!assignments || assignments.length === 0) ? (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">No Assignments Found</h3>
          <p className="mt-2 text-muted-foreground">
            You don't have any assignments at the moment.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAssignments?.map((assignment) => (
            <AssignmentCard key={assignment.id} assignment={assignment} />
          ))}
        </div>
      )}
    </div>
  );
};

const AssignmentCard = ({ assignment }: { assignment: any }) => {
  const dueDate = assignment.due_date ? new Date(assignment.due_date) : null;
  const isPastDue = dueDate ? dueDate < new Date() : false;
  
  const getStatusBadge = () => {
    if (assignment.submitted) {
      return (
        <Badge className="bg-green-500">
          <CheckCircle2 className="h-3 w-3 mr-1" />
          Submitted
        </Badge>
      );
    }
    
    if (isPastDue) {
      return (
        <Badge variant="destructive">
          <AlertCircle className="h-3 w-3 mr-1" />
          Past Due
        </Badge>
      );
    }
    
    return (
      <Badge variant="outline" className="border-amber-500 text-amber-500">
        <Clock className="h-3 w-3 mr-1" />
        Pending
      </Badge>
    );
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{assignment.title}</CardTitle>
          {getStatusBadge()}
        </div>
        <p className="text-sm text-muted-foreground">{assignment.course_name}</p>
      </CardHeader>
      <CardContent>
        <p className="text-sm mb-4 line-clamp-2">{assignment.description || 'No description provided.'}</p>
        
        <div className="flex justify-between items-center text-sm text-muted-foreground mb-4">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            {dueDate ? dueDate.toLocaleDateString() : 'No due date'}
          </div>
          <div>{assignment.points} points</div>
        </div>
        
        <Button variant={assignment.submitted ? "outline" : "default"} className="w-full">
          {assignment.submitted ? 'View Submission' : 'Start Assignment'}
        </Button>
      </CardContent>
    </Card>
  );
};
