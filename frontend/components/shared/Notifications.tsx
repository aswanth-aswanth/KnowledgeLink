import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { GoBell } from "react-icons/go";

const notifications = [
  {
    id: 1,
    title: "New Comment",
    description: "You have a new comment on your post.",
    time: "2 mins ago",
  },
  {
    id: 2,
    title: "New Like",
    description: "Someone liked your comment.",
    time: "10 mins ago",
  },
  {
    id: 3,
    title: "New Follower",
    description: "You have a new follower.",
    time: "30 mins ago",
  },
];

export default function PopoverDemo() {
  return (
    <Popover >
      <PopoverTrigger asChild>
        <GoBell className="text-2xl cursor-pointer" />
      </PopoverTrigger>
      <PopoverContent className="w-80 mt-5 mr-2 z-0 p-4 shadow-lg rounded-lg">
        <h4 className="font-medium leading-none mb-2">Notifications</h4>
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div key={notification.id} className="border-b pb-2">
              <h5 className="font-semibold">{notification.title}</h5>
              <p className="text-sm text-muted-foreground">
                {notification.description}
              </p>
              <span className="text-xs text-gray-500">{notification.time}</span>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
