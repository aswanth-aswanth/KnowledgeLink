export interface Meeting {
    _id: string;
    meetingId: string;
    title: string;
    description: string;
    scheduledTime: string;
    createdBy: string;
    invitedUsers: string[];
}
