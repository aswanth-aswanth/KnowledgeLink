import { useState } from 'react';
import { messages as initialMessages, currentUser } from '@/data/sampleData';
import { Message } from '@/types';

export default function ChatWindow({ isDarkMode }: { isDarkMode: boolean }) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMessage, setNewMessage] = useState('');

  const handleSend = () => {
    if (newMessage.trim()) {
      const newMsg: Message = {
        id: Date.now().toString(),
        text: newMessage,
        sender: currentUser,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isOwn: true,
      };
      setMessages([...messages, newMsg]);
      setNewMessage('');
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <div className={`${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'} p-4 border-b`}>
        <h2 className="text-xl font-semibold">Coffee Nerds</h2>
      </div>
      <div className={`flex-1 overflow-y-auto p-4 space-y-4 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
              message.isOwn 
                ? 'bg-green-500 text-white' 
                : isDarkMode 
                  ? 'bg-gray-700 text-white' 
                  : 'bg-gray-200'
            }`}>
              <p>{message.text}</p>
              <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{message.timestamp}</p>
            </div>
          </div>
        ))}
      </div>
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-4 border-t`}>
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className={`flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 ${
              isDarkMode ? 'bg-gray-700 text-white' : 'bg-white'
            }`}
            placeholder="Write a reply..."
          />
          <button
            onClick={handleSend}
            className="bg-green-500 text-white rounded-full p-2 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}