import { Chat } from '../../domain/entities/Chat';
import { Message } from '../../domain/entities/Message';
import ChatModel, { IChatDocument } from '../../infra/databases/mongoose/models/Chat';
import mongoose from 'mongoose';
import MessageModel, { IMessageDocument } from '../../infra/databases/mongoose/models/Message';
import UserModel, { IUser } from '../../infra/databases/mongoose/models/User';

interface UserChatInfo {
  username: string;
  userId: string;
  chatId: string;
  lastMessage: string;
  updatedAt: Date;
  image: string;
}

interface GroupChatInfo {
  chatId: string;
  name: string;
  lastMessage: string;
  updatedAt: Date;
}

export default class ChatRepository {
  public async createIndividualChat(currentUserId: string, participantId: string): Promise<Chat> {
    try {
      const chat = Chat.create([currentUserId, participantId], 'individual');
      const newChatDocument = new ChatModel({
        participants: chat.participants.map(id => new mongoose.Types.ObjectId(id)),
        type: chat.type,
        messages: [],
        createdAt: chat.createdAt,
        updatedAt: chat.updatedAt
      });

      const savedChat: IChatDocument = await newChatDocument.save();

      return this.documentToEntity(savedChat);
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Error creating individual chat: ${error.message}`);
        throw new Error('Failed to create individual chat');
      } else {
        console.error('Unknown error creating individual chat');
        throw new Error('Unknown error');
      }
    }
  }

  // public async addMessage(chatId: string, message: Message): Promise<Chat> {
  //   try {
  //     const chat = await ChatModel.findById(chatId);
  //     if (!chat) {
  //       throw new Error('Chat not found');
  //     }

  //     const newMessage = new MessageModel({
  //       senderId: new mongoose.Types.ObjectId(message.senderId),
  //       content: message.content,
  //       createdAt: message.createdAt
  //     });

  //     chat.messages.push(newMessage);

  //     const updatedChat = await chat.save();
  //     return this.documentToEntity(updatedChat);
  //   } catch (error) {
  //     if (error instanceof Error) {
  //       console.error(`Error adding message: ${error.message}`);
  //       throw new Error('Failed to add message');
  //     } else {
  //       console.error('Unknown error adding message');
  //       throw new Error('Unknown error');
  //     }
  //   }
  // }

  public async getAllGroupChats(): Promise<IChatDocument[]> {
    return await ChatModel.find({ type: 'group' }).select("name createdAt updatedAt _id").exec();
  }

  public async deleteMessage(chatId: string, messageId: string): Promise<void> {
    const chatObjectId = new mongoose.Types.ObjectId(chatId);
    const messageObjectId = new mongoose.Types.ObjectId(messageId);

    const result = await ChatModel.updateOne(
      { _id: chatObjectId },
      { $pull: { messages: { _id: messageObjectId } } }
    );

    if (result.modifiedCount === 0) {
      throw new Error('Message not found or already deleted');
    }
  }

  public async getGroupMembers(chatId: string): Promise<any[]> {
    const chat = await ChatModel.findById(chatId).populate('participants', 'username email image').exec();
    if (!chat) {
      throw new Error('Group chat not found');
    }

    return chat.participants;
  }

  private documentToEntity(doc: IChatDocument): Chat {
    return new Chat(
      doc._id.toString(),
      doc.participants.map(p => p.toString()),
      doc.type,
      doc.messages.map(m => new Message(
        m._id.toString(),
        doc._id.toString(),
        m.senderId.toString(),
        m.content,
        m.createdAt,
        m.readBy.map(r => ({
          userId: r.userId.toString(),
          readAt: r.readAt
        }))
      )),
      doc.createdAt,
      doc.updatedAt,
      doc.name
    );
  }

  public async getChatById(chatId: string): Promise<Chat | null> {
    try {
      const chat = await ChatModel.findById(chatId);

      if (!chat) {
        return null;
      }

      return this.documentToEntity(chat);
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Error getting chat by ID: ${error.message}`);
        throw new Error('Failed to get chat');
      } else {
        console.error('Unknown error getting chat by ID');
        throw new Error('Unknown error');
      }
    }
  }

  public async getUserChats(userId: string): Promise<UserChatInfo[]> {
    try {
      const chats = await ChatModel.find({ participants: userId })
        .populate('participants', 'username image _id')
        .populate('messages')
        .sort({ updatedAt: -1 });

      const uniqueUsersMap = new Map<string, UserChatInfo>();

      chats.forEach(chat => {
        const otherParticipant = chat.participants.find((participant: IUser | mongoose.Types.ObjectId) => {
          if (participant instanceof mongoose.Types.ObjectId) {
            return participant.toString() !== userId.toString();
          } else if (participant && participant._id) {
            return participant._id.toString() !== userId.toString();
          }
          return false;
        }) as IUser | undefined;

        if (otherParticipant && 'username' in otherParticipant && otherParticipant._id) {
          if (!uniqueUsersMap.has(otherParticipant._id.toString())) {
            const lastMessage = chat.messages.length > 0 ? chat.messages[chat.messages.length - 1].content : '';
            uniqueUsersMap.set(otherParticipant._id.toString(), {
              username: otherParticipant.username,
              image: otherParticipant.image,
              chatId: chat._id.toString(),
              userId: otherParticipant._id,
              lastMessage,
              updatedAt: chat.updatedAt
            });
          }
        }
      });

      return Array.from(uniqueUsersMap.values()).sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Error getting user chats: ${error.message}`);
        throw new Error('Failed to get user chats');
      } else {
        console.error('Unknown error getting user chats');
        throw new Error('Unknown error');
      }
    }
  }

  public async getUserGroupChats(userId: string): Promise<GroupChatInfo[]> {
    try {
      const groupChats = await ChatModel.find({
        participants: userId,
        type: 'group'
      })
        .sort({ updatedAt: -1 })
        .populate({
          path: 'messages',
          options: { sort: { createdAt: -1 }, limit: 1 }
        });

      return groupChats.map(chat => ({
        chatId: chat._id.toString(),
        name: chat.name || 'Unnamed Group',
        lastMessage: chat.messages.length > 0 ? chat.messages[0].content : '',
        updatedAt: chat.updatedAt
      }));
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Error getting user group chats: ${error.message}`);
        throw new Error('Failed to get user group chats');
      } else {
        console.error('Unknown error getting user group chats');
        throw new Error('Unknown error');
      }
    }
  }

  public async getMessageById(chatId: string, messageId: string): Promise<Message | null> {
    const chatObjectId = new mongoose.Types.ObjectId(chatId);
    const messageObjectId = new mongoose.Types.ObjectId(messageId);

    const chatDoc = await ChatModel.findOne({ _id: chatObjectId }).exec();

    if (!chatDoc) return null;

    const messageDoc = chatDoc.messages.find(msg => msg._id.toString() === messageObjectId.toString());

    if (!messageDoc) return null;

    return this.mapMessageDocumentToEntity(messageDoc, chatId);
  }

  public async updateMessage(chatId: string, message: Message): Promise<Message> {
    // console.log("updateMessage\n");
    // console.log("chat Id : ", chatId);
    // console.log("message : ", message);

    const chatObjectId = new mongoose.Types.ObjectId(chatId);
    const messageObjectId = new mongoose.Types.ObjectId(message.id);

    const chatDoc = await ChatModel.findOne({ _id: chatObjectId }).exec();

    if (!chatDoc) throw new Error('Chat not found');

    const messageDoc = chatDoc.messages.find(msg => msg._id.toString() === messageObjectId.toString());

    if (!messageDoc) throw new Error('Message not found');

    // Update message fields
    messageDoc.senderId = new mongoose.Types.ObjectId(message.senderId);
    messageDoc.content = message.content;
    messageDoc.createdAt = message.createdAt;
    messageDoc.readBy = message.readBy.map(readReceipt => ({
      userId: new mongoose.Types.ObjectId(readReceipt.userId),
      readAt: readReceipt.readAt
    }));

    const updatedChatDoc = await chatDoc.save();
    // console.log("updatedChatDoc : ",updatedChatDoc);

    const updatedMessageDoc = updatedChatDoc.messages.find(msg => msg._id.toString() === messageObjectId.toString());

    if (!updatedMessageDoc) throw new Error('Updated message not found');

    return this.mapMessageDocumentToEntity(updatedMessageDoc, chatId);
  }

  private mapMessageDocumentToEntity(messageDoc: any, chatId: string): Message {
    return new Message(
      messageDoc._id.toString(),
      chatId, // Use the chatId passed as a parameter
      messageDoc.senderId.toString(),
      messageDoc.content,
      messageDoc.createdAt,
      Array.isArray(messageDoc.readBy) ? messageDoc.readBy.map((readReceipt: any) => ({
        userId: readReceipt.userId.toString(),
        readAt: readReceipt.readAt,
      })) : []
    );
  }


  public async createGroupChat(name: string, participantIds: string[]): Promise<Chat> {
    try {
      const chat = Chat.create(participantIds, 'group', name);
      const newChatDocument = new ChatModel({
        name: chat.name,
        participants: chat.participants.map(id => new mongoose.Types.ObjectId(id)),
        type: chat.type,
        messages: [],
        createdAt: chat.createdAt,
        updatedAt: chat.updatedAt
      });

      const savedChat: IChatDocument = await newChatDocument.save();

      return this.documentToEntity(savedChat);
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Error creating group chat: ${error.message}`);
        throw new Error('Failed to create group chat');
      } else {
        console.error('Unknown error creating group chat');
        throw new Error('Unknown error');
      }
    }
  }

  public async addMessage(chatId: string, message: Message): Promise<Message> {
    const chat = await ChatModel.findById(chatId);
    if (!chat) {
      throw new Error('Chat not found');
    }

    const newMessage = new MessageModel({
      senderId: new mongoose.Types.ObjectId(message.senderId),
      content: message.content,
      createdAt: message.createdAt
    });

    chat.messages.push(newMessage);
    await chat.save();

    return this.messageDocumentToEntity(newMessage, chatId);
  }

  public async addMessageWithPopulatedSender(chatId: string, message: Message): Promise<any> {
    const chat = await ChatModel.findById(chatId);
    if (!chat) {
      throw new Error('Chat not found');
    }

    const newMessage = new MessageModel({
      senderId: new mongoose.Types.ObjectId(message.senderId),
      content: message.content,
      createdAt: message.createdAt
    });

    chat.messages.push(newMessage);
    await chat.save();

    const populatedSender = await UserModel.findById(message.senderId).lean();

    if (!populatedSender) {
      throw new Error('Sender not found');
    }

    const messageWithSenderInfo = {
      ...this.messageDocumentToEntity(newMessage, chatId),
      senderInfo: {
        _id: populatedSender._id.toString(),
        username: populatedSender.username,
        image: populatedSender.image
      }
    };

    return messageWithSenderInfo;
  }

  private messageDocumentToEntity(doc: IMessageDocument, chatId: string): Message {
    return new Message(
      doc._id.toString(),
      chatId,
      doc.senderId.toString(),
      doc.content,
      doc.createdAt,
    );
  }

  // private messageDocumentToEntity(doc: IMessageDocument, chatId: string): Message {
  //   return new Message(
  //     doc._id.toString(),
  //     chatId,
  //     doc.senderId.toString(),
  //     doc.content,
  //     doc.createdAt
  //   );
  // }

  public async addUserToChat(chatId: string, userId: string): Promise<Chat> {
    const chat = await ChatModel.findByIdAndUpdate(
      chatId,
      { $addToSet: { participants: userId } },
      { new: true }
    ).populate('messages');

    if (!chat) {
      throw new Error('Chat not found');
    }

    return this.documentToEntity(chat);
  }

  public async removeUserFromChat(chatId: string, userId: string): Promise<Chat> {
    const chat = await ChatModel.findByIdAndUpdate(
      chatId,
      { $pull: { participants: userId } },
      { new: true }
    ).populate('messages');

    if (!chat) {
      throw new Error('Chat not found');
    }

    return this.documentToEntity(chat);
  }

  public async updateChat(chatId: string, updateData: { name?: string }): Promise<Chat> {
    const chat = await ChatModel.findByIdAndUpdate(
      chatId,
      { $set: updateData },
      { new: true }
    ).populate('messages');

    if (!chat) {
      throw new Error('Chat not found');
    }

    return this.documentToEntity(chat);
  }

  public async deleteChat(chatId: string): Promise<void> {
    const result = await ChatModel.findByIdAndDelete(chatId);

    if (!result) {
      throw new Error('Chat not found');
    }
  }
}
