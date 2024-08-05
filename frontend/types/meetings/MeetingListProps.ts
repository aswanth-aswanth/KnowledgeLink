import { Meeting } from "./Meeting";

export type MeetingListProps = {
    meetings: Meeting[];
    currentUserEmail: string;
};