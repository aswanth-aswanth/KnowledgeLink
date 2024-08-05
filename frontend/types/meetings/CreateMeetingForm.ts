export interface FormData {
    title: string;
    description: string;
    scheduledTime: string;
    invitedUsers: string[];
}

export interface User {
    _id: string;
    id: string;
    username: string;
    email: string;
    image?: string;
}

export interface CreateMeetingFormProps {
    onMeetingCreated: () => Promise<void>;
}
