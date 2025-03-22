
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, FileText } from "lucide-react";
import { toast } from "sonner";
import { Assignment } from "./types/assignment-types";
import { fetchStudentAssignments } from "./utils/assignment-utils";
import { AssignmentList } from "./AssignmentList";

export const MyAssignments = () => {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadAssignments = async () => {
      if (!user?.id) {
        setIsLoading(false);
        return;
      }
      
      try {
        const assignmentsData = await fetchStudentAssignments(user.id);
        setAssignments(assignmentsData);
        
        if (assignmentsData.length === 0) {
          toast.info("No assignments found", {
            description: "You don't have any assignments assigned to you yet."
          });
        }
      } catch (error) {
        console.error("Error fetching assignments:", error);
        toast.error("Failed to load your assignments");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadAssignments();
  }, [user?.id]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return <AssignmentList assignments={assignments} setAssignments={setAssignments} />;
};
