const ChatPage = () => {
    return (
      <div className="min-h-screen bg-[#191d20] text-gray-300 p-4">
        <header className="mb-6">
          <nav className="flex items-center space-x-2 text-sm">
            <span>Home</span>
            <span>&gt;</span>
            <span>Chat</span>
            <span>&gt;</span>
            <span className="text-gray-500">26769a09-73ca-443c-8359-b2b2ea2c7dd6</span>
          </nav>
        </header>
  
        <main>
          <h1 className="text-xl mb-4">What are the requirements for getting placed in a top company</h1>
  
          <section className="mb-6">
            <h2 className="font-semibold mb-2">Answer</h2>
            <p className="mb-4">
              It seems that the provided context does not contain specific information regarding the requirements
              for getting placed in a top company. The context only mentions a personal note about needing to get
              placed by September, without detailing any requirements or criteria.
            </p>
            <p>
              If you have more specific context or details about the requirements, please share, and I can assist
              you further!
            </p>
          </section>
  
          <section>
            <h2 className="font-semibold mb-2">Related Memories</h2>
            <div className="bg-[#25262b] p-3 rounded-md">
              <h3 className="text-sm font-semibold mb-1">note</h3>
              <p className="text-sm">I have to get placed ...</p>
              <p className="text-xs text-gray-500 mt-2">Note created at 7/27/2024, 12:49:45 PM</p>
            </div>
          </section>
        </main>
  
        <footer className="mt-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Ask your second brain..."
              className="w-full bg-[#25262b] rounded-md py-2 px-4 pr-10 text-gray-300 placeholder-gray-500"
            />
            <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500">
              →
            </button>
          </div>
        </footer>
      </div>
    );
  };
  
  export default ChatPage;