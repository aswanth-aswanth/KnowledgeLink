interface ToolbarProps {
  onAddRectangle: () => void;
  onStartConnecting: () => void;
  isConnecting: boolean;
  onCreateConnection: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({
  onAddRectangle,
  onStartConnecting,
  isConnecting,
  onCreateConnection,
}) => {
  return (
    <div className="bg-gray-800 text-white p-4 flex space-x-4">
      <button
        className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded"
        onClick={onAddRectangle}
      >
        Add Rectangle
      </button>
      <button
        className={`px-4 py-2 rounded ${
          isConnecting
            ? "bg-green-500 hover:bg-green-600"
            : "bg-yellow-500 hover:bg-yellow-600"
        }`}
        onClick={isConnecting ? onCreateConnection : onStartConnecting}
      >
        {isConnecting ? "Create Connection" : "Start Connecting"}
      </button>
    </div>
  );
};
export default Toolbar;
