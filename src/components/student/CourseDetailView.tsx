
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CourseMaterialsView } from "./CourseMaterialsView";
import { CourseAssignmentsView } from "./CourseAssignmentsView";
import { CourseAttendanceView } from "./CourseAttendanceView";
import { AssignmentDetailView } from "./AssignmentDetailView";

interface CourseDetailViewProps {
  selectedCourse: any;
  courseAssignments: any[];
  courseAttendance: any[];
  onBack: () => void;
  onAssignmentsChange: (assignments: any[]) => void;
}

export const CourseDetailView: React.FC<CourseDetailViewProps> = ({
  selectedCourse,
  courseAssignments,
  courseAttendance,
  onBack,
  onAssignmentsChange
}) => {
  const [selectedTab, setSelectedTab] = useState("materials");
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null);

  const handleAssignmentSelect = (assignment: any) => {
    setSelectedAssignment(assignment);
  };

  const handleAssignmentSubmit = (updatedAssignment: any) => {
    // Update the assignments list with the submitted assignment
    const updatedAssignments = courseAssignments.map(a => 
      a.id === updatedAssignment.id ? updatedAssignment : a
    );
    
    onAssignmentsChange(updatedAssignments);
    setSelectedAssignment(null);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onBack}>
          Back to Courses
        </Button>
        <h2 className="text-2xl font-bold">{selectedCourse.course.title}</h2>
      </div>
      
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="materials">Course Materials</TabsTrigger>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
        </TabsList>
        
        <TabsContent value="materials" className="space-y-6">
          <CourseMaterialsView 
            course={selectedCourse.course}
            enrollment={selectedCourse}
          />
        </TabsContent>
        
        <TabsContent value="assignments" className="space-y-6">
          {selectedAssignment ? (
            <AssignmentDetailView 
              assignment={selectedAssignment}
              onBack={() => setSelectedAssignment(null)}
              onSubmit={handleAssignmentSubmit}
            />
          ) : (
            <CourseAssignmentsView 
              assignments={courseAssignments}
              onAssignmentSelect={handleAssignmentSelect}
            />
          )}
        </TabsContent>
        
        <TabsContent value="attendance" className="space-y-6">
          <CourseAttendanceView attendance={courseAttendance} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
