
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Sparkles } from "lucide-react";

interface AiAssignmentDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  courses: any[];
  newAssignment: {
    title: string;
    description: string;
    course_id: string;
    due_date: string;
    points: number;
    is_ai_generated: boolean;
    programming_language?: string;
  };
  aiPrompt: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onPointsChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCourseChange: (value: string) => void;
  onAiPromptChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSelectChange?: (field: string, value: string) => void;
  onCreateAiAssignment: () => void;
}

export const AiAssignmentDialog = ({
  isOpen,
  onOpenChange,
  courses,
  newAssignment,
  aiPrompt,
  onInputChange,
  onPointsChange,
  onCourseChange,
  onAiPromptChange,
  onSelectChange,
  onCreateAiAssignment
}: AiAssignmentDialogProps) => {
  const [assignmentType, setAssignmentType] = useState<string>("written");

  // Handle assignment type change
  const handleAssignmentTypeChange = (value: string) => {
    setAssignmentType(value);
    if (onSelectChange) {
      onSelectChange("assignment_type", value);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Sparkles className="h-4 w-4 mr-2" />
          AI Assignment
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[650px]">
        <DialogHeader>
          <DialogTitle>Generate AI Assignment</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="course">Course</Label>
            <Select 
              value={newAssignment.course_id} 
              onValueChange={onCourseChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select course" />
              </SelectTrigger>
              <SelectContent>
                {courses.map((course) => (
                  <SelectItem key={course.id} value={course.id}>
                    {course.title} {course.course_code ? `(${course.course_code})` : ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label>Assignment Type</Label>
            <Tabs value={assignmentType} onValueChange={handleAssignmentTypeChange} className="w-full">
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="written">Written Assignment</TabsTrigger>
                <TabsTrigger value="programming">Programming Assignment</TabsTrigger>
              </TabsList>
              
              <TabsContent value="programming" className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="programming_language">Programming Language</Label>
                  <Select 
                    value={newAssignment.programming_language || ""}
                    onValueChange={(value) => onSelectChange && onSelectChange("programming_language", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="java">Java</SelectItem>
                      <SelectItem value="c">C</SelectItem>
                      <SelectItem value="cpp">C++</SelectItem>
                      <SelectItem value="javascript">JavaScript</SelectItem>
                      <SelectItem value="python">Python</SelectItem>
                      <SelectItem value="csharp">C#</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="ai-prompt">
              What kind of assignment do you want to generate?
            </Label>
            <Textarea 
              id="ai-prompt" 
              value={aiPrompt}
              onChange={onAiPromptChange}
              placeholder={assignmentType === "programming" 
                ? "Describe the programming assignment you want to create (e.g., Create a sorting algorithm in Java that can sort an array of integers efficiently)" 
                : "Describe the assignment you want to create (e.g., An essay about the impact of artificial intelligence on society)"
              }
              rows={5}
            />
            <p className="text-xs text-muted-foreground mt-1">
              The AI will generate a title, description, and {assignmentType === "programming" ? "code template" : ""} based on your prompt.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="due_date">Due Date</Label>
              <Input 
                id="due_date" 
                name="due_date"
                type="date"
                value={newAssignment.due_date}
                onChange={onInputChange}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="points">Points</Label>
              <Input 
                id="points" 
                name="points"
                type="number"
                value={newAssignment.points}
                onChange={onPointsChange}
                min={1}
                max={1000}
              />
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onCreateAiAssignment}>
            Generate Assignment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
