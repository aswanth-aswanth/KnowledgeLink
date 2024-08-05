import { Button } from "@/components/ui/button";
import { FiPlusSquare } from "react-icons/fi";

export function CreatePostButton({ onClick }: { onClick: () => void }) {
  return (
    <FiPlusSquare
      onClick={onClick}
      className="text-4xl cursor-pointer text-gray-500 "
    />
  );
}
