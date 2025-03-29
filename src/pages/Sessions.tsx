
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Sample session data based on the provided image
const sessionData = [
  { id: 3, userId: 1907, deviceId: 843, startTime: "2025-03-28 12:59:20.1060000 +00:00", endTime: "2025-03-28 12:59:20.4510000 +00:00" },
  { id: 4, userId: 1876, deviceId: 843, startTime: "2025-03-28 11:27:33.3170000 +00:00", endTime: "2025-03-28 11:28:12.7730000 +00:00" },
  { id: 5, userId: 1875, deviceId: 843, startTime: "2025-03-28 10:56:08.6190000 +00:00", endTime: "2025-03-28 10:59:31.2350000 +00:00" },
  { id: 6, userId: 1858, deviceId: 843, startTime: "2025-03-28 09:48:01.1560000 +00:00", endTime: "2025-03-28 09:48:10.6190000 +00:00" },
  { id: 7, userId: 1856, deviceId: 843, startTime: "2025-03-28 09:40:48.1250000 +00:00", endTime: "2025-03-28 09:41:24.6160000 +00:00" },
  { id: 8, userId: 1857, deviceId: 843, startTime: "2025-03-28 09:33:30.9480000 +00:00", endTime: "2025-03-28 09:35:28.1860000 +00:00" },
];

// Calculate session duration in a readable format
const calculateDuration = (startTime: string, endTime: string) => {
  const start = new Date(startTime);
  const end = new Date(endTime);
  
  const diffMs = end.getTime() - start.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  
  const hours = Math.floor(diffSec / 3600);
  const minutes = Math.floor((diffSec % 3600) / 60);
  const seconds = diffSec % 60;
  
  if (hours > 0) {
    return `${hours}h ${minutes}m ${seconds}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  } else {
    return `${seconds}s`;
  }
};

const Sessions = () => {
  return (
    <>
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">User Sessions</h1>
        <p className="text-gray-500 dark:text-gray-400">View details about user application sessions.</p>
      </div>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Session Overview</CardTitle>
            <CardDescription>Detailed information about user sessions.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableCaption>Recent user sessions with duration</TableCaption>
              <TableHeader>
                <TableRow className="bg-drooid-gray/10">
                  <TableHead>ID</TableHead>
                  <TableHead>User ID</TableHead>
                  <TableHead>Device ID</TableHead>
                  <TableHead>Start Time</TableHead>
                  <TableHead>End Time</TableHead>
                  <TableHead>Duration</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sessionData.map((session) => (
                  <TableRow key={session.id}>
                    <TableCell>{session.id}</TableCell>
                    <TableCell>{session.userId}</TableCell>
                    <TableCell>{session.deviceId}</TableCell>
                    <TableCell className="font-mono text-xs">
                      {new Date(session.startTime).toLocaleString()}
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {new Date(session.endTime).toLocaleString()}
                    </TableCell>
                    <TableCell className="font-semibold text-drooid-orange">
                      {calculateDuration(session.startTime, session.endTime)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Average Session Duration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-drooid-orange">1m 12s</div>
              <p className="text-sm text-muted-foreground">Average time users spend on the app</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Total Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-drooid-orange">156</div>
              <p className="text-sm text-muted-foreground">Total recorded sessions</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Active Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-drooid-orange">24</div>
              <p className="text-sm text-muted-foreground">Users with recent sessions</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Sessions;
