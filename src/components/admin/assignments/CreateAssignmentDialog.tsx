
import React from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Plus, Code } from "lucide-react";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";

interface CreateAssignmentDialogProps {
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
    code_template?: string;
    expected_output?: string;
    assignment_type?: string;
  };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onPointsChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCourseChange: (value: string) => void;
  onSelectChange: (field: string, value: string) => void;
  onCreateAssignment: () => void;
}

export const CreateAssignmentDialog = ({
  isOpen,
  onOpenChange,
  courses,
  newAssignment,
  onInputChange,
  onPointsChange,
  onCourseChange,
  onSelectChange,
  onCreateAssignment
}: CreateAssignmentDialogProps) => {
  const [assignmentTypeTab, setAssignmentTypeTab] = React.useState("written");

  // Handle assignment type selection
  const handleAssignmentTypeChange = (value: string) => {
    setAssignmentTypeTab(value);
    onSelectChange("assignment_type", value);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Assignment
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[650px]">
        <DialogHeader>
          <DialogTitle>Create New Assignment</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Assignment Title</Label>
            <Input 
              id="title" 
              name="title"
              value={newAssignment.title}
              onChange={onInputChange}
              placeholder="Enter assignment title"
            />
          </div>
          
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
            <Tabs value={assignmentTypeTab} onValueChange={handleAssignmentTypeChange} className="w-full">
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="written">Written Assignment</TabsTrigger>
                <TabsTrigger value="programming">Programming Assignment</TabsTrigger>
              </TabsList>
              
              <TabsContent value="written" className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="description">Instructions</Label>
                  <Textarea 
                    id="description" 
                    name="description"
                    value={newAssignment.description}
                    onChange={onInputChange}
                    placeholder="Provide detailed instructions for students"
                    rows={3}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="programming" className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="description">Instructions</Label>
                  <Textarea 
                    id="description" 
                    name="description"
                    value={newAssignment.description}
                    onChange={onInputChange}
                    placeholder="Provide detailed instructions for students"
                    rows={3}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="programming_language">Programming Language</Label>
                  <Select 
                    value={newAssignment.programming_language || ""}
                    onValueChange={(value) => onSelectChange("programming_language", value)}
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
                
                <div className="grid gap-2">
                  <Label htmlFor="code_template">Code Template (optional)</Label>
                  <Textarea 
                    id="code_template" 
                    name="code_template"
                    value={newAssignment.code_template || ""}
                    onChange={onInputChange}
                    placeholder="Provide starter code template for students"
                    rows={3}
                    className="font-mono text-sm"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="expected_output">Expected Output (optional)</Label>
                  <Textarea 
                    id="expected_output" 
                    name="expected_output"
                    value={newAssignment.expected_output || ""}
                    onChange={onInputChange}
                    placeholder="Provide expected output for test cases"
                    rows={2}
                    className="font-mono text-sm"
                  />
                </div>
              </TabsContent>
            </Tabs>
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
          <Button onClick={onCreateAssignment}>
            Create Assignment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
