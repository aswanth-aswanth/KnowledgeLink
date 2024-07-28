export interface ReadReceipt {
  userId: string;
  readAt: Date;
}

export class Message {
  constructor(
    public id: string,
    public chatId: string,
    public senderId: string,
    public content: string,
    public createdAt: Date,
    public readBy: ReadReceipt[] = []
  ) { }

  static create(chatId: string, senderId: string, content: string): Message {
    return new Message(
      '',
      chatId,
      senderId,
      content,
      new Date()
    );
  }
}

export interface MessageWithIsOwn extends Message {
  isOwn: boolean;
}
