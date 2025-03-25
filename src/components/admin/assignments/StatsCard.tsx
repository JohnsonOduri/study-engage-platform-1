
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface StatsCardProps {
  title: string;
  value: string;
  subtitle: string;
}

export const StatsCard = ({ title, value, subtitle }: StatsCardProps) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold mt-1">{value}</p>
          <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
        </div>
      </CardContent>
    </Card>
  );
};
