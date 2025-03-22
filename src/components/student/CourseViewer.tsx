import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Accordion } from "@/components/ui/accordion";
import { ModuleItem } from "./ModuleItem"; // Assuming ModuleItem is defined elsewhere
import { AIGeneratedCourse } from "./types/ai-course-types";

interface CourseViewerProps {
  course: AIGeneratedCourse;
}

export const CourseViewer: React.FC<CourseViewerProps> = ({ course }) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{course.title}</CardTitle>
          <CardDescription>
            {course.description}
            <div className="flex gap-2 mt-2">
              <Badge variant="outline">{course.durationDays} days</Badge>
              <Badge variant="secondary">{course.modules.length} modules</Badge>
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <h3 className="text-lg font-semibold mb-2">Course Syllabus</h3>
          <p className="whitespace-pre-wrap text-sm text-muted-foreground mb-4">
            {course.syllabus}
          </p>

          <h3 className="text-lg font-semibold mt-6 mb-4">Modules</h3>
          <Accordion type="single" collapsible className="w-full">
            {course.modules.map((module) => (
              <ModuleItem key={module.id} module={module} />
            ))}
          </Accordion>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => window.print()}>
            Print Course Materials
          </Button>
          <Button>Save Course</Button>
        </CardFooter>
      </Card>
    </div>
  );
};
