import { users, channels } from '@/data/sampleData';

export default function Sidebar({ isDarkMode }: { isDarkMode: boolean }) {
  return (
    <div className={`w-64 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'} border-r hidden md:block overflow-y-auto`}>
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4">Chat Room</h2>
        <div className="mb-6">
          <h3 className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mb-2`}>FAVOURITES</h3>
          <ul className="space-y-2">
            {users.map((user) => (
              <li key={user.id} className="flex items-center space-x-3">
                <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
                <span>{user.name}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mb-2`}>CHANNELS</h3>
          <ul className="space-y-2">
            {channels.map((channel) => (
              <li key={channel.id} className="flex items-center space-x-3">
                <span>#</span>
                <span>{channel.name}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}