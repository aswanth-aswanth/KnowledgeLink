// components/MeetingList.tsx
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import JitsiMeetComponent from "./[roomName]/JitsiMeetComponent";
import { useRouter } from "next/navigation";

type Meeting = {
  _id: string;
  meetingId: string;
  title: string;
  description?: string;
  scheduledTime: string;
  createdBy: string;
  invitedUsers: string[];
};

type MeetingListProps = {
  meetings: Meeting[];
  currentUserEmail: string;
};

export function MeetingList({ meetings, currentUserEmail }: MeetingListProps) {
  const [selectedMeeting, setSelectedMeeting] = useState<string | null>(null);
  const router = useRouter();

  const handleJoinMeeting = (meetingId: string) => {
    router.push(`/meeting/${meetingId}`);
  };

  if (selectedMeeting) {
    return <JitsiMeetComponent roomName={selectedMeeting} />;
  }

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {meetings.map((meeting) => (
        <Card key={meeting._id} className="bg-white dark:bg-gray-800 shadow-md">
          <CardHeader className="p-4">
            <CardTitle className="text-lg sm:text-xl text-gray-900 dark:text-gray-100 mb-1">
              {meeting.title}
            </CardTitle>
            <CardDescription className="text-sm text-gray-600 dark:text-gray-400">
              {new Date(meeting.scheduledTime).toLocaleString()}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
              {meeting.description}
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge
                variant={
                  meeting.createdBy === currentUserEmail
                    ? "default"
                    : "secondary"
                }
                className="text-xs sm:text-sm px-2 py-1 text-white"
              >
                {meeting.createdBy === currentUserEmail ? "Created" : "Invited"}
              </Badge>
              {meeting.invitedUsers && meeting.invitedUsers.length > 0 && (
                <Badge
                  variant="outline"
                  className="text-xs sm:text-sm px-2 py-1"
                >
                  {meeting.invitedUsers.length} Attendee
                  {meeting.invitedUsers.length !== 1 ? "s" : ""}
                </Badge>
              )}
            </div>
          </CardContent>
          <CardFooter className="p-4 pt-0 flex justify-end">
            <Button
              size="sm"
              variant="outline"
              className="text-xs dark:text-white sm:text-sm"
              onClick={() => handleJoinMeeting(meeting.meetingId)}
            >
              Join Meeting
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
