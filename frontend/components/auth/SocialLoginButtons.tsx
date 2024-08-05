import React from "react";
import { socialButtons } from "@/lib/socialButtons";

const SocialLoginButtons = () => {
  return (
    <div className="flex justify-center space-x-4 mb-4">
      {socialButtons.map(({ name, icon, color, onClick }) => (
        <button
          key={name}
          className={`flex items-center justify-center w-12 h-12 rounded-full ${color}`}
          onClick={onClick}
        >
          {icon}
        </button>
      ))}
    </div>
  );
};

export default SocialLoginButtons;
