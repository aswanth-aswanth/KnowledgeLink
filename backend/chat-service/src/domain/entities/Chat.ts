// src/domain/entities/Chat.ts

import { Message } from './Message';

export class Chat {
  constructor(
    public readonly id: string,
    public readonly participants: string[],
    public readonly type: 'individual' | 'group',
    public readonly messages: Message[],
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly name?: string 
  ) {}

  static create(participants: string[], type: 'individual' | 'group', name?: string): Chat {
    const now = new Date();
    return new Chat(
      '', // id will be set by the database
      participants,
      type,
      [],
      now,
      now,
      name
    );
  }
}

 /*  static create(participants: string[], type: 'individual' | 'group'): Chat {
    return new Chat(
      '',
      participants,
      type,
      [],
      new Date(),
      new Date()
    );
  }

  addMessage(message: Message): void {
    this.messages.push(message);
    this.updatedAt = new Date();
  }
} */