import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
function DashBoardCards({ cardtitle, Icon, content, description, color }) {
  return (
    <div>
      <Card className={`p-2 bg-${color}`}>
        <CardHeader className="flex flex-row items-center justify-between px-1 py-1 ">
          <CardTitle className="text-sm font-medium text-gray-500">
            {cardtitle}
          </CardTitle>
          {Icon && <Icon className={`h-6 w-6 ${color}`} />}
        </CardHeader>
        <CardContent className="px-1 py-1">
          <div className={`text-2xl font-bold ${color}`}>{content}</div>
          <p className="text-xs text-gray-500">{description}</p>
        </CardContent>
      </Card>
    </div>
  );
}

export default DashBoardCards;
