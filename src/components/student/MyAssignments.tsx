
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Loader2, FileText, Clock, CheckCircle2, AlertCircle } from "lucide-react";

export const MyAssignments = () => {
  const { user } = useAuth();
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  
  const { data: assignments, isLoading } = useQuery({
    queryKey: ["student-assignments", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      // First get all courses the student is enrolled in
      const { data: enrollments, error: enrollmentError } = await supabase
        .from('enrollments')
        .select('course_id')
        .eq('user_id', user.id);
        
      if (enrollmentError) throw enrollmentError;
      
      if (!enrollments || enrollments.length === 0) return [];
      
      const courseIds = enrollments.map(e => e.course_id);
      
      // Then get all assignments for those courses
      const { data: assignmentsData, error: assignmentsError } = await supabase
        .from('assignments')
        .select('*, courses(title)')
        .in('course_id', courseIds)
        .order('due_date', { ascending: true });
        
      if (assignmentsError) throw assignmentsError;
      
      // Get student's submissions
      const { data: submissions, error: submissionsError } = await supabase
        .from('submissions')
        .select('*')
        .eq('user_id', user.id);
        
      if (submissionsError) throw submissionsError;
      
      // Combine assignments with submission status
      return (assignmentsData || []).map(assignment => {
        const submission = submissions?.find(s => s.assignment_id === assignment.id);
        return {
          ...assignment,
          submitted: !!submission,
          submission: submission,
          course_name: assignment.courses?.title || 'Unknown Course'
        };
      });
    },
    enabled: !!user?.id
  });

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
