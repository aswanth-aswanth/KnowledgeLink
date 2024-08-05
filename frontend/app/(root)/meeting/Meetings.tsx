import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { CreateMeetingForm } from "../../../components/forms/CreateMeetingForm";
import { MeetingList } from "./MeetingList";
import apiClient from "@/api/apiClient";
import { Meeting } from "@/types/meetings";

export default function MeetingsPage() {
  const user = useSelector((state: RootState) => state.auth.user);
  const [activeTab, setActiveTab] = useState("all");
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMeetings();
  }, []);

  const fetchMeetings = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get("/notification/meeting");
      setMeetings(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredMeetings = {
    all: meetings,
    created: meetings.filter((meeting) => meeting.createdBy === user?.email),
    invited: meetings.filter(
      (meeting) =>
        meeting.invitedUsers.includes(user?.email || "") &&
        meeting.createdBy !== user?.email
    ),
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">
        Meetings
      </h1>
      <div className="mb-6">
        <CreateMeetingForm onMeetingCreated={fetchMeetings} />
      </div>
      <div className="w-full">
        <div className="flex mb-4 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
          {["all", "created", "invited"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 px-3 py-2 text-sm sm:text-base transition-colors duration-200 ${
                activeTab === tab
                  ? "bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)} Meetings
            </button>
          ))}
        </div>
        <div className="mt-4 text-xs">
          <MeetingList
            meetings={filteredMeetings[activeTab]}
            currentUserEmail={user?.email || ""}
          />
        </div>
      </div>
    </div>
  );
}
