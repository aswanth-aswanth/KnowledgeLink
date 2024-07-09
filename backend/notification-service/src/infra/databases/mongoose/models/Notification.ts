import mongoose, { Schema, Document, Model, model } from 'mongoose';

// Notification Interface
export interface INotification extends Document {
    type: string;
    content: string;
    createdAt?: Date;
    read?: boolean;
}

// Notification Schema
const notificationSchemaModel = new Schema<INotification>({
    type: { type: String, required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    read: { type: Boolean, default: false },
});

// Recipient Notification Interface
export interface IRecipientNotifications extends Document {
    recipient: string;
    notifications: INotification[];
}

// Recipient Notification Schema
const recipientNotificationSchema = new Schema<IRecipientNotifications>({
    recipient: { type: String, required: true, unique: true },
    notifications: {
        type: [notificationSchemaModel],
        default: [],
    },
});

// Pre-save hook to handle capping the notifications array
recipientNotificationSchema.pre('save', function (next) {
    if (this.notifications.length > 30) {
        this.notifications = this.notifications.slice(-30);
    }
    next();
});

// Model
const RecipientNotification: Model<IRecipientNotifications> = model<IRecipientNotifications>('RecipientNotification', recipientNotificationSchema);

export default RecipientNotification;
