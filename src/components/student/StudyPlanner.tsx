
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  BookOpen,
  Check,
  Plus,
  RotateCw,
  FileText,
  Trash2,
  Bot
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const StudyPlanner = () => {
  const { user } = useAuth();
  const [date, setDate] = useState<Date | undefined>(new Date());
  
  // Sample study plan data
  const studyPlanData = [
    { 
      id: 1, 
      title: "Web Development", 
      tasks: [
        { id: 1, title: "Review HTML & CSS basics", duration: 45, completed: true, time: "9:00 AM" },
        { id: 2, title: "JavaScript Practice - Arrays and Objects", duration: 60, completed: false, time: "10:00 AM" },
        { id: 3, title: "Building responsive layouts", duration: 90, completed: false, time: "2:00 PM" },
      ]
    },
    { 
      id: 2, 
      title: "Database Design", 
      tasks: [
        { id: 4, title: "SQL Query Practice", duration: 60, completed: false, time: "11:30 AM" },
        { id: 5, title: "ER Diagrams Assignment", duration: 120, completed: false, time: "4:00 PM" },
      ]
    },
  ];

  const generateAIPlan = () => {
    toast.success("AI-generated study plan created!");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Study Planner</h2>
          <p className="text-muted-foreground">Plan your study sessions and track your progress</p>
        </div>
        
        <div className="flex gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-fit flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" />
                {date ? format(date, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          
          <Button onClick={generateAIPlan} className="gap-2">
            <Bot className="h-4 w-4" />
            Generate AI Plan
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {studyPlanData.map(course => (
            <Card key={course.id}>
              <CardHeader>
                <CardTitle>{course.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {course.tasks.map(task => (
                    <div 
                      key={task.id} 
                      className={cn(
                        "flex items-center justify-between p-4 border rounded-lg",
                        task.completed ? "border-green-200 bg-green-50 dark:bg-green-900/10" : "border-border"
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div className={cn(
                          "w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5",
                          task.completed ? "bg-green-500" : "border border-muted"
                        )}>
                          {task.completed && <Check className="h-4 w-4 text-white" />}
                        </div>
                        <div>
                          <h4 className="font-medium">{task.title}</h4>
                          <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                            <div className="flex items-center">
                              <Clock className="h-3.5 w-3.5 mr-1" />
                              {task.time}
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-3.5 w-3.5 mr-1" />
                              {task.duration} min
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        {!task.completed && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-green-600 border-green-200"
                            onClick={() => toast.success(`Marked "${task.title}" as completed!`)}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                        )}
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full gap-2">
                  <Plus className="h-4 w-4" />
                  Add Task
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Add Study Session</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="task-title">Task Title</Label>
                  <Input id="task-title" placeholder="Enter task title" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="course">Course</Label>
                  <Input id="course" placeholder="Select course" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="time">Start Time</Label>
                    <Input id="time" type="time" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration (min)</Label>
                    <Input id="duration" type="number" min="5" step="5" defaultValue="30" />
                  </div>
                </div>
                
                <Button 
                  type="button" 
                  className="w-full mt-2"
                  onClick={() => toast.success("Study session added to your plan!")}
                >
                  Add to Plan
                </Button>
              </form>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Study Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="bg-primary/10 p-2 rounded-full h-fit">
                    <Clock className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">Pomodoro Technique</h4>
                    <p className="text-sm text-muted-foreground">Study for 25 minutes, then take a 5-minute break.</p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className="bg-primary/10 p-2 rounded-full h-fit">
                    <RotateCw className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">Spaced Repetition</h4>
                    <p className="text-sm text-muted-foreground">Review material at increasing intervals for better retention.</p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className="bg-primary/10 p-2 rounded-full h-fit">
                    <BookOpen className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">Active Recall</h4>
                    <p className="text-sm text-muted-foreground">Test yourself rather than passively reviewing notes.</p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className="bg-primary/10 p-2 rounded-full h-fit">
                    <FileText className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">Cornell Note-Taking</h4>
                    <p className="text-sm text-muted-foreground">Divide your notes into main points, details, and summary.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
