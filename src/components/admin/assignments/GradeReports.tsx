
import React from "react";
import { StatsCard } from "./StatsCard";

interface GradeReportsProps {
  assignmentsCount: number;
}

export const GradeReports = ({ assignmentsCount }: GradeReportsProps) => {
  return (
    <div className="mt-6">
      <h3 className="text-lg font-medium mb-4">Grade Reports</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Completed Assignments" value={assignmentsCount.toString()} subtitle="Total assignments" />
        <StatsCard title="Average Score" value="N/A" subtitle="Across all courses" />
        <StatsCard title="Highest Grade" value="N/A" subtitle="Not available yet" />
        <StatsCard title="Grade Improvements" value="N/A" subtitle="Not available yet" />
      </div>
    </div>
  );
};
