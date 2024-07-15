import { Chat } from '../../domain/entities/Chat';
import { Message } from '../../domain/entities/Message';
import ChatModel, { IChatDocument } from '../../infra/databases/mongoose/models/Chat';
import mongoose from 'mongoose';
import MessageModel, { IMessageDocument } from '../../infra/databases/mongoose/models/Message';

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
        m.createdAt
      )),
      doc.createdAt,
      doc.updatedAt,
      doc.name 
    );
  }

  public async getChatById(chatId: string): Promise<Chat | null> {
    try {
      const chat = await ChatModel.findById(chatId).populate('messages');

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

  public async getUserChats(userId: string): Promise<Chat[]> {
    try {
      const chats = await ChatModel.find({ participants: userId })
        .populate('messages')
        .sort({ updatedAt: -1 });

      return chats.map(chat => this.documentToEntity(chat));
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

  private messageDocumentToEntity(doc: IMessageDocument, chatId: string): Message {
    return new Message(
      doc._id.toString(),
      chatId,
      doc.senderId.toString(),
      doc.content,
      doc.createdAt
    );
  }
}
