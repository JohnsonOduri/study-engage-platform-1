
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Brain, Calendar, CheckSquare, Clock, Trash2 } from "lucide-react";

interface AssignmentCardProps {
  assignment: any;
  onDelete: (id: string) => void;
}

export const AssignmentCard = ({ assignment, onDelete }: AssignmentCardProps) => {
  return (
    <div className="border border-border rounded-lg p-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium">{assignment.title}</h3>
          {assignment.is_ai_generated && (
            <Badge variant="outline" className="mt-1 bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
              <Brain className="h-3 w-3 mr-1" />
              AI Generated
            </Badge>
          )}
        </div>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onDelete(assignment.id)}>
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      </div>
      <p className="text-sm text-muted-foreground mt-1">{assignment.course_title}</p>
      <div className="flex gap-4 mt-3 text-sm">
        <div className="flex items-center gap-1">
          <CheckSquare className="h-4 w-4 text-primary" />
          <span>{assignment.submissions_count || 0} submitted</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="h-4 w-4 text-primary" />
          <span>{assignment.points} points</span>
        </div>
      </div>
    </div>
  );
};
