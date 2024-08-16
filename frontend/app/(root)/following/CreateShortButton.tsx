import React from 'react';
import { IoVideocamOutline } from "react-icons/io5";

interface CreateShortButtonProps {
  onClick: () => void;
}

export const CreateShortButton: React.FC<CreateShortButtonProps> = ({
  onClick,
}) => {
  return (
    <IoVideocamOutline
      onClick={onClick}
      className="text-4xl cursor-pointer text-gray-500"
    />
  );
};
