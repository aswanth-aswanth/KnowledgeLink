import { users, sharedFiles } from "@/data/sampleData";

export default function ProfileSection({
  isDarkMode,
}: {
  isDarkMode: boolean;
}) {
  const profileUser = users[0]; 

  return (
    <div
      className={`w-80 ${
        isDarkMode ? "bg-gray-800 text-white" : "bg-white"
      } border-l hidden lg:block p-4 overflow-y-auto`}
    >
      <div className="text-center mb-6">
        <img
          src={profileUser.avatar}
          alt={profileUser.name}
          className="w-24 h-24 rounded-full mx-auto mb-4"
        />
        <h2 className="text-xl font-semibold">{profileUser.name}</h2>
        <p
          className={`text-sm ${
            isDarkMode ? "text-gray-400" : "text-gray-500"
          }`}
        >
          {profileUser.status}
        </p>
      </div>
      <div className="mb-6">
        <h3
          className={`text-sm font-medium ${
            isDarkMode ? "text-gray-400" : "text-gray-500"
          } mb-2`}
        >
          Shared files
        </h3>
        <ul className="space-y-2">
          {sharedFiles.map((file, index) => (
            <li key={index} className="flex items-center justify-between">
              <span className="text-sm">{file.name}</span>
              <span
                className={`text-xs ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                {file.size}
              </span>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex justify-between">
        <button
          className={`px-4 py-2 ${
            isDarkMode
              ? "bg-gray-700 hover:bg-gray-600"
              : "bg-gray-200 hover:bg-gray-300"
          } rounded-md`}
        >
          Message
        </button>
        <button
          className={`px-4 py-2 ${
            isDarkMode
              ? "bg-gray-700 hover:bg-gray-600"
              : "bg-gray-200 hover:bg-gray-300"
          } rounded-md`}
        >
          Video Call
        </button>
      </div>
    </div>
  );
}
