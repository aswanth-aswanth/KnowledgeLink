import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-md p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Alex's Mind</h1>
        <div className="flex space-x-4">
          {/* Add icons for map, document, search, etc. */}
        </div>
      </div>
    </header>
  );
};

export default Header;