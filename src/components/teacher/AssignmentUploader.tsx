
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Upload } from "lucide-react";
import { toast } from "sonner";
import { ref, push, set } from "firebase/database";
import { database } from "@/firebase";
import { useAuth } from "@/contexts/AuthContext";

interface AssignmentUploaderProps {
  courseId?: string;
}

export const AssignmentUploader: React.FC<AssignmentUploaderProps> = ({ courseId }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [points, setPoints] = useState("10");
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error("Please enter an assignment title");
      return;
    }
    
    if (!user?.id) {
      toast.error("You must be logged in to create an assignment");
      return;
    }
    
    if (!courseId) {
      toast.error("Course ID is required to create an assignment");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Create assignment in the database
      const assignmentRef = push(ref(database, 'assignments'));
      await set(assignmentRef, {
        course_id: courseId,
        teacher_id: user.id,
        title,
        description,
        due_date: dueDate ? format(dueDate, 'yyyy-MM-dd') : null,
        points: parseInt(points) || 10,
        created_at: new Date().toISOString(),
        // In a real app, you would upload the file to storage and store the URL here
        file_name: file ? file.name : null,
      });
      
      toast.success("Assignment created successfully");
      
      // Reset form
      setTitle("");
      setDescription("");
      setDueDate(undefined);
      setPoints("10");
      setFile(null);
      
    } catch (error) {
      console.error("Error creating assignment:", error);
      toast.error("Failed to create assignment");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Assignment</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Assignment Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter assignment title"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter assignment description"
              rows={4}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Due Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dueDate ? format(dueDate, 'PPP') : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dueDate}
                    onSelect={setDueDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="points">Points</Label>
              <Input
                id="points"
                type="number"
                min="1"
                max="100"
                value={points}
                onChange={(e) => setPoints(e.target.value)}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="file">Attachment (Optional)</Label>
            <Input
              id="file"
              type="file"
              onChange={handleFileChange}
            />
            {file && (
              <p className="text-sm text-muted-foreground">
                {file.name} ({Math.round(file.size / 1024)} KB)
              </p>
            )}
          </div>
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <span>Creating Assignment...</span>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Create Assignment
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
