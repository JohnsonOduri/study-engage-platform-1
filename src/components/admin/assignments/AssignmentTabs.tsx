
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Search, Trash, Calendar, Check, Code } from "lucide-react";
import { StatsCard } from "./StatsCard";

export const AssignmentTabs = ({ assignments, isLoading, onDeleteAssignment }) => {
  const [searchQuery, setSearchQuery] = useState("");
  
  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  // Filter assignments based on search query
  const filteredAssignments = assignments?.filter(assignment => 
    assignment.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    assignment.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    assignment.course_title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    assignment.course_code?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Count active, completed and total assignments
  const activeCount = filteredAssignments?.filter(a => 
    a.due_date && new Date(a.due_date) > new Date()
  ).length;
  
  const pastDueCount = filteredAssignments?.filter(a => 
    a.due_date && new Date(a.due_date) < new Date()
  ).length;
  
  const totalCount = filteredAssignments?.length || 0;
  
  // Format date to readable string
  const formatDate = (dateString) => {
    if (!dateString) return "No due date";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  // Check if assignment is past due
  const isPastDue = (dateString) => {
    if (!dateString) return false;
    return new Date(dateString) < new Date();
  };

  // Get programming language label
  const getProgrammingLanguageLabel = (lang) => {
    if (!lang) return null;
    
    const labels = {
      'java': 'Java',
      'c': 'C',
      'cpp': 'C++',
      'javascript': 'JavaScript',
      'python': 'Python',
      'csharp': 'C#',
      'other': 'Other'
    };
    
    return labels[lang] || lang;
  };
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatsCard 
          title="Active Assignments" 
          value={activeCount.toString()} 
          subtitle="Currently open" 
        />
        <StatsCard 
          title="Past Due" 
          value={pastDueCount.toString()} 
          subtitle="Closed assignments" 
        />
        <StatsCard 
          title="Total Assignments" 
          value={totalCount.toString()} 
          subtitle="All assignments" 
        />
      </div>
      
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Assignments List</h3>
        <div className="relative w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search assignments..."
            className="w-full pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="past">Past Due</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-4">
          {filteredAssignments?.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No assignments found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAssignments?.map(assignment => (
                <AssignmentCard 
                  key={assignment.id} 
                  assignment={assignment} 
                  formatDate={formatDate}
                  isPastDue={isPastDue}
                  onDelete={onDeleteAssignment}
                  getProgrammingLanguageLabel={getProgrammingLanguageLabel}
                />
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="active" className="space-y-4">
          {filteredAssignments?.filter(a => a.due_date && new Date(a.due_date) > new Date()).length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No active assignments</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAssignments
                ?.filter(a => a.due_date && new Date(a.due_date) > new Date())
                .map(assignment => (
                  <AssignmentCard 
                    key={assignment.id} 
                    assignment={assignment} 
                    formatDate={formatDate}
                    isPastDue={isPastDue}
                    onDelete={onDeleteAssignment}
                    getProgrammingLanguageLabel={getProgrammingLanguageLabel}
                  />
                ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="past" className="space-y-4">
          {filteredAssignments?.filter(a => a.due_date && new Date(a.due_date) < new Date()).length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No past due assignments</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAssignments
                ?.filter(a => a.due_date && new Date(a.due_date) < new Date())
                .map(assignment => (
                  <AssignmentCard 
                    key={assignment.id} 
                    assignment={assignment} 
                    formatDate={formatDate}
                    isPastDue={isPastDue}
                    onDelete={onDeleteAssignment}
                    getProgrammingLanguageLabel={getProgrammingLanguageLabel}
                  />
                ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

const AssignmentCard = ({ assignment, formatDate, isPastDue, onDelete, getProgrammingLanguageLabel }) => {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex gap-1.5">
              {assignment.is_ai_generated && (
                <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                  AI Generated
                </Badge>
              )}
              {assignment.programming_language && (
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  <Code className="h-3 w-3 mr-1" />
                  {getProgrammingLanguageLabel(assignment.programming_language)}
                </Badge>
              )}
            </div>
            {isPastDue(assignment.due_date) ? (
              <Badge variant="secondary">Closed</Badge>
            ) : (
              <Badge variant="default">Open</Badge>
            )}
          </div>
          
          <h3 className="font-semibold line-clamp-1">{assignment.title}</h3>
          <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
            <span>{assignment.course_title}</span>
            {assignment.course_code && (
              <Badge variant="outline" className="font-mono text-xs">
                {assignment.course_code}
              </Badge>
            )}
          </div>
          
          {assignment.description && (
            <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
              {assignment.description}
            </p>
          )}
          
          <div className="flex items-center mt-4 text-sm">
            <Calendar className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
            <span className={isPastDue(assignment.due_date) ? "text-red-500" : ""}>
              Due: {formatDate(assignment.due_date)}
            </span>
          </div>
          
          <div className="flex items-center mt-1.5 text-sm">
            <Check className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
            <span>
              Points: {assignment.points}
            </span>
          </div>
          
          {typeof assignment.submissions_count === 'number' && (
            <div className="mt-3 text-xs text-muted-foreground">
              {assignment.submissions_count} submission{assignment.submissions_count !== 1 ? 's' : ''}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="px-6 py-4 bg-muted/20 border-t flex justify-between">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => onDelete(assignment.id)}
        >
          <Trash className="h-4 w-4 text-destructive" />
        </Button>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            View Submissions
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
