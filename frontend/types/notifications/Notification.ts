export interface Notification {
    type: "comment" | "like";
    content: string;
    createdAt: string;
    read: boolean;
    _id: string;
}
