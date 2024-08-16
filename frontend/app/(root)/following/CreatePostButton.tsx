import { FiPlusSquare } from 'react-icons/fi';

export function CreatePostButton({ onClick }: { onClick: () => void }) {
  return (
    <FiPlusSquare
      onClick={onClick}
      className="text-3xl cursor-pointer text-gray-500 "
    />
  );
}
